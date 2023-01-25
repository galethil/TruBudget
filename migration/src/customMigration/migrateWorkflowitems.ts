import { AssertParams, assertStreamItem } from "../assert";
import { getFromTxOutData } from "../helper/migrationHelper";
import {
  MigrateFunction,
  MigrationCompleted,
  MigrationStatus,
  MoveFunction,
  VerifyParams,
} from "../migrate";
import { createStreamItem } from "../rpc";
import { DataJSON, Item } from "../types/item";
import { handleEventWithDocuments } from "./migrateDocuments";

export interface updatedEvent extends DataJSON {
  update: {
    documents: [];
  };
}

export interface createdEvent extends DataJSON {
  workflowitem: {
    documents: [];
  };
}

export const makeProjectUploader = (projectId: string): MigrateFunction => {
  return {
    stream: projectId,
    function: async (params: MoveFunction): Promise<MigrationCompleted> => {
      const { sourceChain, destinationChain, item, stream } = params;

      try {
        // Prepare readable item
        if (!item.available)
          return {
            status: MigrationStatus.Failed,
          };
        let itemToMigrate: Item = item;
        const txId = item.txid;
        let status = MigrationStatus.Ok;

        if (
          item.data &&
          item.data.hasOwnProperty("vout") &&
          item.data.hasOwnProperty("txid")
        ) {
          itemToMigrate = await getFromTxOutData(sourceChain, item);
        }

        // Way to migrate workflowitem_updated or workflowitem_created item
        const isWorkflowitemUpdatedEvent: boolean =
          itemToMigrate.data.json.type === "workflowitem_updated";
        const isWorkflowitemCreatedEvent: boolean =
          itemToMigrate.data.json.type === "workflowitem_created";
        const hasDocumentsUpdate: boolean =
          (itemToMigrate.data.json as updatedEvent).update?.documents?.length >
          0;
        const hasDocumentsAttached: boolean =
          (itemToMigrate.data.json as createdEvent).workflowitem?.documents
            ?.length > 0;

        if (isWorkflowitemCreatedEvent && hasDocumentsAttached) {
          await handleEventWithDocuments(
            sourceChain,
            destinationChain, //destinationApi axios instance
            stream,
            itemToMigrate
          );

          return { status: MigrationStatus.Ok };
        }
        if (isWorkflowitemUpdatedEvent && hasDocumentsUpdate) {
          await handleEventWithDocuments(
            sourceChain,
            destinationChain, //destinationApi axios instance
            stream,
            itemToMigrate
          );

          return { status: MigrationStatus.Ok };
        }

        // Default way to migrate item
        const req = await createStreamItem(
          destinationChain,
          stream,
          item.keys,
          itemToMigrate
        );
        console.log(
          `Created key ${JSON.stringify(
            item.keys
          )} on destination chain with tx ${req}`
        );
        return {
          sourceChainTx: txId,
          destinationChainTx: req,
          status,
        };
      } catch (error) {
        console.error(
          `Error while migrating item with txid ${params.item.txid} with ${error.message}. 
          The item will be skipped. Please check if ignoring this event is safe and does not lead to invalid data.`,
          params.item,
          error
        );
        return {
          status: MigrationStatus.Skipped,
        };
      }
    },
    verifier: async (params: VerifyParams): Promise<boolean> => {
      const {
        sourceChain,
        destinationChain,
        stream,
        sourceChainTx,
        destinationChainTx,
        status,
      } = params;
      const assertion: AssertParams = {
        sourceChain,
        destinationChain,
        stream,
        sourceChainTx,
        destinationChainTx,
      };

      if (status === MigrationStatus.Skipped) {
        return true;
      }

      return await assertStreamItem(assertion);
    },
  };
};
