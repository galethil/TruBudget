import mapLimit from 'async/mapLimit';
import * as crypto from 'crypto';

import {
  downloadFileFromApi,
  downloadFileFromStorageService,
  getApiInstanceForUser,
  getWorkflowItemDetails,
  grantAllPermissionsOnWorkflowItem,
  uploadViaApi,
  WorkflowItemDetailsDocument,
} from '../helper/apiHelper';
import ApplicationConfiguration from '../helper/config';
import {
  decrypt,
  decryptWithKey,
  extractFileContentFromDocumentsOnChain as extractFileContentFromDocumentOnChain,
  getStreamItemByTx,
  getStreamKeyItems,
  OnchainDocument,
} from '../helper/migrationHelper';
import { MigrateFunction, MigrationCompleted, MigrationStatus, MoveFunction, VerifyParams } from '../migrate';
import { SecretPublishedEvent } from '../types/item';

const MAX_ASYNC_OPERATIONS = 3;

const hashBase64 = (base64String: string): Promise<string> => {
  return new Promise<string>((resolve) => {
    const hash = crypto.createHash("sha256");
    hash.update(Buffer.from(base64String, "base64"));
    resolve(hash.digest("hex"));
  });
};

export const documentUploader: MigrateFunction = {
  stream: "offchain_documents",
  function: async (params: MoveFunction): Promise<MigrationCompleted> => {
    const { sourceChain, item } = params;
    const workflowItemEvent = item.data.json;
    // const workflowItemEvent = iteml

    const documents = workflowItemEvent.update
      ? workflowItemEvent.update.documents
      : workflowItemEvent.workflowitem.documents;

    const eventContent = workflowItemEvent.update
      ? workflowItemEvent.update
      : workflowItemEvent.workflowitem;
    const eventType = workflowItemEvent.type; // workflowitem_updated or workflowitem_created - used to know where to send request
    const workflowitemEventData = {
      apiVersion: "1.0",
      data: {
        ...eventContent,
        documents: [],
        additionalData: {},
      },
    };

    const privKeyEncryped: string = await getStreamKeyItems(
      sourceChain,
      `org:${ApplicationConfiguration.ORGANIZATION}`,
      "privateKey"
    )[0].data.json.privateKey;

    const privKey = decrypt(
      ApplicationConfiguration.ORGANIZATION_VAULT_SECRET,
      privKeyEncryped
    );

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

        try {
          // old doc workflowitem_document_uploaded - get document
          if (isOldDocumentStreamItem) {
            const document: OnchainDocument =
              await extractFileContentFromDocumentOnChain(sourceChain, item);
            workflowitemEventData.data.documents.push({
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

            workflowitemEventData.data.documents.push({
              id: document.id,
              fileName: document.fileName,
              base64: base64Document,
            });
            // send request to api with uploaded file
          }

          // upload document in workflowitem_updated/created event via api

          //TODO: what do we do with storage_service_url_published events?
          const { projectId, subprojectId, workflowitemId, fileMetadata } =
            document;

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
          /*await grantAllRightsToUser(
                    rootUserApi,
                    ApplicationConfiguration.MIGRATION_USER_USERNAME
                  );*/
          await uploadViaApi(migrationUserApi, {
            projectId,
            subprojectId,
            workflowitemId,
            fileMetadata: {
              document: {
                ...fileMetadata,
              },
            },
          });

          //There is no need to save changes on destination chain since API is processing request.

          return {
            sourceChainTx: item.txid,
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
            `Error while uploading file ${params.item.txid} via API with ${error.message}`
          );
        }
      }
    }
  },
  verifier: async (params: VerifyParams): Promise<boolean> => {
    const { sourceChain, stream, sourceChainTx, additionalData } = params;
    const sourceItem = await getStreamItemByTx(
      sourceChain,
      stream,
      sourceChainTx
    );
    const documentOnSourceChain = await extractFileContentFromDocumentOnChain(
      sourceChain,
      sourceItem
    );
    const documentOnSourceChainHash = await hashBase64(
      documentOnSourceChain.fileMetadata.base64
    );

    const {
      projectId: destinationProjectId,
      subprojectId: destinationSubprojectId,
      workflowitemId: destinationWorkflowitemId,
    } = additionalData;

    const migrationUserApi = await getApiInstanceForUser(
      ApplicationConfiguration.MIGRATION_USER_USERNAME,
      ApplicationConfiguration.MIGRATION_USER_PASSWORD
    );

    const destinationWorkflowItem = await getWorkflowItemDetails(
      migrationUserApi,
      destinationProjectId,
      destinationSubprojectId,
      destinationWorkflowitemId
    );

    // We do not know the new id of the document since api defines id
    // Workaround: get workflow item & check all files with same name & hash
    const documentsToVerify = destinationWorkflowItem.documents.filter(
      (document: WorkflowItemDetailsDocument) => {
        return (
          document.fileName === documentOnSourceChain.fileMetadata.fileName &&
          document.hash === documentOnSourceChainHash
        );
      }
    );

    const destinationFilesAvailable = documentsToVerify.length > 0;

    const allDocumentsReachable = await mapLimit(
      documentsToVerify,
      MAX_ASYNC_OPERATIONS,
      async (document) => {
        const destinationFileIsReachable = await downloadFileFromApi(
          migrationUserApi,
          destinationProjectId,
          destinationSubprojectId,
          destinationWorkflowitemId,
          document.id
        );
        return destinationFileIsReachable.hash === document.hash;
      }
    );

    return (
      documentsToVerify.length === allDocumentsReachable.length &&
      destinationFilesAvailable &&
      allDocumentsReachable.every((e) => e === true)
    );
  },
};
