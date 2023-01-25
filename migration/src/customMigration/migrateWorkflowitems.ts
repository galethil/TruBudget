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
import { DataJSON } from "../types/item";

interface updatedJSON extends DataJSON {
  update: {
    documents: [];
  };
}

interface createdJSON extends DataJSON {
  workflowitem: {
    documents: [];
  };
}
export const makeProjectUploader = (projectId: string): MigrateFunction => {
  return {
    stream: projectId,
    function: async (params: MoveFunction): Promise<MigrationCompleted> => {
      const { sourceChain, destinationChain, item, stream, documentUploader } =
        params;

      try {
        if (!item.available)
          return {
            status: MigrationStatus.Failed,
          };
        let itemToMigrate = item;
        const txId = item.txid;
        let status = MigrationStatus.Ok;

        if (
          item.data &&
          item.data.hasOwnProperty("vout") &&
          item.data.hasOwnProperty("txid")
        ) {
          itemToMigrate = await getFromTxOutData(sourceChain, item);
        }
        if (
          itemToMigrate.data.json.type === "workflowitem_updated" &&
          (itemToMigrate.data.json as unknown as updatedJSON).update
            .documents && // here
          (itemToMigrate.data.json as unknown as updatedJSON).update.documents
            .length
        ) {
          // read document from source
          // update workflowitem with document
          //documentMigrateFunction?.function
          //give documement id / ids and the workflowitem update item.
          //the function downloads the document from the source chain and sends
          //a /workflowitem.update request via api to destination chain

          documentUploader.function({ sourceChain, item: itemToMigrate });

          status = MigrationStatus.Ok;
          // itemToMigrate = {
          //   ...itemToMigrate,
          //   data: { ...itemToMigrate.data, json: newJson as DataJSON },
          // };
          return {
            status,
          };
        } else if (
          itemToMigrate.data.json.type === "workflowitem_created" &&
          (itemToMigrate.data.json as unknown as createdJSON).workflowitem
            .documents &&
          (itemToMigrate.data.json as unknown as createdJSON).workflowitem
            .documents.length
        ) {
          // const newJson = itemToMigrate.data.json as unknown as createdJSON;
          // newJson.workflowitem.documents = [];

          //migrate docs here too

          documentUploader.function({ sourceChain, item: itemToMigrate });

          status = MigrationStatus.Ok;

          // status = MigrationStatus.Skipped;
          // itemToMigrate = {
          //   ...itemToMigrate,
          //   data: { ...itemToMigrate.data, json: newJson as DataJSON },
          // };
        }
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
