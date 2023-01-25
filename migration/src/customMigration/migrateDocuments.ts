import mapLimit from "async/mapLimit";
import * as crypto from "crypto";

import {
  downloadFileFromApi,
  downloadFileFromStorageService,
  getApiInstanceForUser,
  getWorkflowItemDetails,
  grantAllPermissionsOnWorkflowItem,
  uploadViaApi,
  WorkflowItemDetailsDocument,
} from "../helper/apiHelper";
import ApplicationConfiguration from "../helper/config";
import {
  decrypt,
  decryptWithKey,
  extractFileContentFromDocumentsOnChain as extractFileContentFromDocumentOnChain,
  getStreamItemByTx,
  getStreamKeyItems,
  OnchainDocument,
} from "../helper/migrationHelper";
import {
  MigrateFunction,
  MigrationCompleted,
  MigrationStatus,
  MoveFunction,
  VerifyParams,
} from "../migrate";
import { Item, SecretPublishedEvent } from "../types/item";
import { updatedEvent, createdEvent } from "./migrateWorkflowitems";
import { createStreamItem } from "../rpc";

interface RequestBodyWorkflowitemUpdate {
  apiVersion: "1.0";
  data: {
    rojectId: string;
    subprojectId: string;
    workflowitemId: string;
    displayName?: string;
    description?: string;
    amountType?: "N/A" | "disbursed" | "allocated";
    amount?: string;
    currency?: string;
    exchangeRate?: string;
    billingDate?: string;
    dueDate?: string;
    documents?: UploadedDocument[];
    additionalData?: object;
  };
}

interface RequestBodyWorkflowitemCreate {
  apiVersion: "1.0";
  data: {
    projectId: string;
    subprojectId: string;
    status?: "open" | "closed";
    displayName: string;
    description?: string;
    assignee?: string;
    currency?: string;
    amount?: string;
    amountType: "N/A" | "disbursed" | "allocated";
    billingDate?: string;
    dueDate?: string;
    exchangeRate?: string;
    documents?: UploadedDocument[];
    additionalData?: object;
    workflowitemType?: Type;
  };
}

export interface WorkflowitemCreatedEvent {
  type: "workflowitem_created";
  source: string;
  time: string; // ISO timestamp
  publisher: string;
  projectId: string;
  subprojectId: string;
  workflowitem: WorkflowitemCreatedInitialData;
}

export interface WorkflowitemUpdatedEvent {
  type: "workflowitem_updated";
  source: string;
  time: string; // ISO timestamp
  publisher: string;
  projectId: string;
  subprojectId: string;
  workflowitemId: string;
  update: Modification;
}

export interface Modification {
  displayName?: string;
  description?: string;
  amount?: string;
  currency?: string;
  amountType?: "N/A" | "disbursed" | "allocated";
  exchangeRate?: string;
  billingDate?: string;
  dueDate?: string;
  documents?: DocumentReference[];
  additionalData?: object;
}

interface WorkflowitemCreatedInitialData {
  id: string;
  status: "open" | "closed";
  displayName: string;
  description: string;
  assignee: string;
  amount?: string;
  currency?: string;
  amountType: "N/A" | "disbursed" | "allocated";
  exchangeRate?: string;
  billingDate?: string;
  dueDate?: string;
  documents: DocumentReference[];
  permissions: Permissions;
  // Additional information (key-value store), e.g. external IDs:
  additionalData: object;
  workflowitemType?: Type;
}

interface DocumentReference {
  id: string;
  fileName: string;
  hash: string;
  available?: boolean;
}

export interface UploadedDocument {
  id: string;
  base64: string;
  fileName: string;
}

type Type = "general" | "restricted";

const MAX_ASYNC_OPERATIONS = 3;

export const handleEventWithDocuments = async (
  sourceChain,
  destinationChain,
  stream,
  streamItem: Item
) => {
  const isWorkflowitemUpdatedEvent: boolean =
    streamItem.data.json.type === "workflowitem_updated";
  const isWorkflowitemCreatedEvent: boolean =
    streamItem.data.json.type === "workflowitem_created";

  let documents = [];
  let apiRequestDocuments: UploadedDocument[] = [];
  let newStreamItem = {};
  let projectId, subprojectId, workflowitemId;

  // Get information out of streamitem

  if (isWorkflowitemUpdatedEvent) {
    projectId = (streamItem.data.json as WorkflowitemUpdatedEvent).projectId;
    subprojectId = (streamItem.data.json as WorkflowitemUpdatedEvent)
      .subprojectId;
    workflowitemId = (streamItem.data.json as WorkflowitemUpdatedEvent)
      .workflowitemId;

    documents = (streamItem.data.json as updatedEvent).update.documents;
    newStreamItem = {
      ...streamItem,
      data: {
        json: {
          update: {
            ...(streamItem.data.json as updatedEvent).update,
            documents: [],
          },
        },
      },
    };
  }

  if (isWorkflowitemCreatedEvent) {
    projectId = (streamItem.data.json as WorkflowitemCreatedEvent).projectId;
    subprojectId = (streamItem.data.json as WorkflowitemCreatedEvent)
      .subprojectId;
    workflowitemId = (streamItem.data.json as WorkflowitemCreatedEvent)
      .workflowitem.id;
    documents = (streamItem.data.json as createdEvent).workflowitem.documents;
    newStreamItem = {
      ...streamItem,
      data: {
        json: {
          workflowitem: {
            ...(streamItem.data.json as createdEvent).workflowitem,
            documents: [],
          },
        },
      },
    };
  }

  // Get actual documents (base64) out of offchain storage (old) or storage service (new)

  const privKeyEncryped: string = await getStreamKeyItems(
    sourceChain,
    `org:${ApplicationConfiguration.ORGANIZATION}`,
    "privateKey"
  )[0].data.json.privateKey;

  const privKey = decrypt(
    ApplicationConfiguration.ORGANIZATION_VAULT_SECRET,
    privKeyEncryped
  );

  try {
    for (const document of documents) {
      const items = await getStreamKeyItems(
        sourceChain,
        "offchain_documents",
        document
      );
      for (const item of items) {
        if (!item.available)
          return {
            status: MigrationStatus.Failed,
          };

        const isOldDocumentStreamItem =
          (item.data &&
            item.data.hasOwnProperty("vout") &&
            item.data.hasOwnProperty("txid")) ||
          item.data.json.type === "workflowitem_document_uploaded";

        const isNewDocumentStreamItem =
          item.data.json.type === "document_uploaded";

        // old doc workflowitem_document_uploaded - get document
        if (isOldDocumentStreamItem) {
          const document: OnchainDocument =
            await extractFileContentFromDocumentOnChain(sourceChain, item);
          apiRequestDocuments.push({
            id: document.fileMetadata.id,
            fileName: document.fileMetadata.fileName,
            base64: document.fileMetadata.base64,
          });
          if (!document)
            return {
              status: MigrationStatus.Failed,
            };
        }

        // new doc - download document from old api
        if (isNewDocumentStreamItem) {
          const secretPublishedItem = items.find((item) => {
            return (
              item.data.json.type === "secret_published" &&
              (item.data.json as SecretPublishedEvent).organization ===
                ApplicationConfiguration.ORGANIZATION
            );
          });
          const encryptedSecret = (
            secretPublishedItem.data.json as SecretPublishedEvent
          ).encryptedSecret;
          const decryptedSecret = decryptWithKey(encryptedSecret, privKey);

          const base64Document = await downloadFileFromStorageService(
            ApplicationConfiguration.SOUCE_STORAGE_SERVICE_URL,
            document.id,
            decryptedSecret
          );

          apiRequestDocuments.push({
            id: document.id,
            fileName: document.fileName,
            base64: base64Document,
          });
        }
      }
    }

    // 1. Migrate event as is without documents
    const response = await createStreamItem(
      destinationChain,
      stream,
      (newStreamItem as Item).keys,
      newStreamItem as Item
    );
    console.log(
      `Created item without documents ${JSON.stringify(
        (newStreamItem as Item).keys
      )} on destination chain with tx ${response}`
    );

    // 2. Get previously cutted documents and migrate them via API generating an extra update event
    const migrationUserApi = await getApiInstanceForUser(
      ApplicationConfiguration.MIGRATION_USER_USERNAME,
      ApplicationConfiguration.MIGRATION_USER_PASSWORD
    );

    const rootUserApi = await getApiInstanceForUser(
      "root",
      ApplicationConfiguration.ROOT_SECRET
    );

    await grantAllPermissionsOnWorkflowItem(
      rootUserApi,
      ApplicationConfiguration.MIGRATION_USER_USERNAME,
      projectId,
      subprojectId,
      workflowitemId
    );

    await uploadViaApi(migrationUserApi, {
      projectId,
      subprojectId,
      workflowitemId,
      documents: apiRequestDocuments,
    });

    return {
      sourceChainTx: streamItem.txid,
      destinationChainTx: "Uploaded via API.",
      status: MigrationStatus.Ok,
      additionalData: {
        projectId,
        subprojectId,
        workflowitemId,
      },
    };
  } catch (error) {
    console.error(error);
    throw Error(
      `Error while uploading files of StreamItem ${streamItem.txid} of stream ${stream} with error ${error.message}`
    );
  }
};
