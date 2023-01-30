import { AssertParams, assertStreamItem } from "./assert";
import {
  getAllStreamItems,
  getAllStreams,
  getFromTxOutData,
} from "./helper/migrationHelper";
import { createStream, createStreamItem, listStreams } from "./rpc";
import { Item } from "./types/item";

export interface MoveFunction {
  sourceChain: any;
  destinationChain?: any;
  stream?: string;
  item: Item;
  documentUploader?: MigrateFunction;
}

export interface MigrationCompleted {
  sourceChainTx?: string;
  destinationChainTx?: string;
  additionalData?: any;
  status: MigrationStatus;
}

export enum MigrationStatus {
  Ok = "OK",
  Skipped = "Skipped",
  Failed = "Failed",
}

export interface VerifyParams {
  sourceChain: any;
  destinationChain: any;
  stream: string;
  sourceChainTx: string;
  destinationChainTx: string;
  status?: MigrationStatus;
  additionalData?: any;
}

export interface MigrateFunction {
  stream: string;

  function(params: MoveFunction): Promise<MigrationCompleted>;

  verifier(params: VerifyParams): Promise<boolean>;
}

export type CustomMigrations = {
  [streamName: string]: MigrateFunction;
};

const createStreamIfNotExists = async (
  destination: any,
  streamName: string,
  kind: any
) => {
  try {
    const streams = await listStreams(destination);
    if (!streams.find((stream) => stream.name === streamName)) {
      await createStream(destination, "stream", streamName, {
        kind,
      });
      console.log(`Created ${streamName} stream`);
    } else {
      console.log("Using existing stream: ", streamName);
    }
  } catch (err) {
    console.log("Error while creating destination stream!", err);
  }
};

const migrateStream = async (
  sourceChain: any,
  destinationChain: any,
  stream: string,
  mover?: MigrateFunction,
  documentUploader?: MigrateFunction
): Promise<MigrationCompleted[] | undefined> => {
  const allItemsOnChain = await getAllStreamItems(sourceChain, stream);

  const result = [];
  // move the events using the default method
  for (const item of allItemsOnChain) {
    if (!mover) {
      try {
        let itemToMigrate = item;
        const txId = item.txid;

        if (
          item.data &&
          item.data.hasOwnProperty("vout") &&
          item.data.hasOwnProperty("txid")
        ) {
          itemToMigrate = await getFromTxOutData(sourceChain, item);
        }
        const req = await createStreamItem(
          destinationChain,
          stream,
          item.keys,
          item
        );
        console.log(
          `Created key ${JSON.stringify(
            item.keys
          )} on destination chain with tx ${req}`
        );

        result.push({
          destinationChainTx: req,
          sourceChainTx: txId,
          status: MigrationStatus.Ok,
        });
      } catch (error) {
        throw new Error(error);
      }
    } else {
      try {
        // move with custom migration function
        const req = await mover.function({
          sourceChain,
          destinationChain,
          stream,
          item,
          documentUploader,
        });
        if (!(req.status === MigrationStatus.Ok)) {
          console.warn(
            `Item was not migrate to destination chain! Result was: ${JSON.stringify(
              req
            )}
        THIS CAN BE IGNORED IF YOU KNOW WHAT YOU ARE DOING!`
          );
          continue;
        }

        console.log(
          `Created key ${JSON.stringify(
            item.keys
          )} on destination chain with tx ${req.destinationChainTx}`
        );
        result.push({
          destinationChainTx: req.destinationChainTx,
          sourceChainTx: req.sourceChainTx,
          status: req.status,
          additionalData: req.additionalData,
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
  return result;
};

export const migrate = async (
  sourceChain: any,
  destinationChain: any,
  streamBlacklist: string[] = [],
  customMigrations: CustomMigrations = {}
) => {
  try {
    const streamsOnSourceChain = await getAllStreams(sourceChain);
    if (!streamsOnSourceChain) throw Error("No streams on source chain");

    //filter out streams
    const streamsOfInterest = streamsOnSourceChain
      .filter((stream) => !streamBlacklist.includes(stream.name))
      .sort((a, b) => {
        if (a.name === "offchain_documents") return 1;
        if (b.name === "offchain_documents") return -1;
        return 0;
      });

    for (const stream of streamsOfInterest) {
      const customMigration = customMigrations[stream.name];

      await createStreamIfNotExists(
        destinationChain,
        stream.name,
        stream.details.kind
      );

      const migratedStream = await migrateStream(
        sourceChain,
        destinationChain,
        stream.name,
        customMigration,
        customMigrations["offchain_documents"]
      );
      if (!migratedStream)
        throw new Error(`Can not migrate stream! ${JSON.stringify(stream)}`);

      // verify the migrated events are valid
      for (const streamItem of migratedStream) {
        if (
          !streamItem ||
          !streamItem.sourceChainTx ||
          !streamItem.destinationChainTx
        )
          throw new Error(
            `Assertion failed! Incomplete stream item ! ${JSON.stringify(
              streamItem
            )}`
          );

        const assertion: AssertParams = {
          sourceChain,
          destinationChain,
          stream: stream.name,
          sourceChainTx: streamItem.sourceChainTx,
          destinationChainTx: streamItem.destinationChainTx,
          additionalData: streamItem.additionalData,
        };

        !customMigration
          ? await assertStreamItem(assertion)
          : await customMigration.verifier(assertion);
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
  return true;
};
