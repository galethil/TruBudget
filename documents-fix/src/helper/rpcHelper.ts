import { listStreamKeyItems } from "../rpc";
import { DocumentUploadedEvent, SecretPublishedEvent } from "../types/events";
import { Item } from "../types/item";

export interface OnchainDocument {
  projectId: string;
  subprojectId: string;
  workflowitemId: string;
  fileMetadata: {
    id: string;
    base64: string;
    fileName: string;
  };

  eventType: string;
}

const getStreamKeyItems = async (
  multichain: any,
  stream: string,
  key: string
): Promise<Item[] | undefined> => {
  try {
    return await listStreamKeyItems(multichain, stream, key);
  } catch (e) {
    console.log("error", e);
  }
};

export const createStreamItem = (
  multichain: any,
  stream: string,
  key: string[],
  event: DocumentUploadedEvent | SecretPublishedEvent
): Promise<string> => {
  return new Promise((resolve, reject) => {
    multichain.publish(
      {
        stream,
        verbose: true,
        key,
        data: { json: event },
      },
      async (err: any, itmes: any) => {
        if (err) {
          return reject(err);
        }
        resolve(itmes);
      }
    );
  });
};

export { getStreamKeyItems };
