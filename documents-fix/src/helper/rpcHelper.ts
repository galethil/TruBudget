import { listStreamKeyItems } from "../rpc";
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

export { getStreamKeyItems };
