import { Item } from "./types/item";

export const listStreamKeyItems = (
  multichain: any,
  stream: string,
  key: string
): Promise<Item[]> => {
  return new Promise((resolve, reject) => {
    multichain.listStreamKeyItems(
      {
        stream,
        key,
        count: 1000000,
      },
      (err: any, itmes: any) => {
        if (err) {
          reject(err);
        }
        resolve(itmes);
      }
    );
  });
};
