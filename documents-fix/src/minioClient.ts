import * as Minio from "minio";
import * as Stream from "stream";

import ApplicationConfiguration from "./helper/config";

interface Metadata extends Minio.ItemBucketMetadata {
  "Content-Type"?: string;
  fileName: string;
  docId: string;
  secret: string;
}

interface MetadataWithName extends Metadata {
  name: string;
}

interface FileWithMeta {
  data: string;
  meta: MetadataWithName;
}

interface FullStat {
  size: number;
  metaData: MetadataWithName;
  lastModified: Date;
  etag: string;
}

const minioClient: Minio.Client = new Minio.Client({
  endPoint: ApplicationConfiguration.MINIO_HOST,
  port: 9000,
  useSSL: false,
  accessKey: ApplicationConfiguration.MINIO_ACCESS_KEY,
  secretKey: ApplicationConfiguration.MINIO_SECRET_KEY,
});

export const listObjectsWithoutMetadata = async () => {
  const objectsList = await new Promise((resolve, reject) => {
    const allObjectsTemp: string[] = [];
    const objectsWithoutMeta: string[] = [];
    const stream = minioClient.listObjectsV2(
      ApplicationConfiguration.MINIO_BUCKET_NAME,
      "",
      true,
      ""
    );

    stream.on("data", (obj) => allObjectsTemp.push(obj.name));
    stream.on("error", reject);
    stream.on("end", async () => {
      for (const name of allObjectsTemp) {
        const meta = await getMetadataAsPromised(name);
        if (!meta.secret) {
          objectsWithoutMeta.push(name);
        }
      }
      resolve(objectsWithoutMeta);
    });
  });
  console.log((objectsList as string[]).length);
  return objectsList;
};

export const getMetadataAsPromised = (
  fileHash: string
): Promise<MetadataWithName> => {
  return new Promise((resolve, reject) => {
    getMetadata(fileHash, (err, metaData: MetadataWithName) => {
      if (err) return reject(err);

      resolve(metaData);
    });
  });
};

const getMetadata = (fileHash: string, cb: Function) => {
  minioClient.statObject(
    ApplicationConfiguration.MINIO_BUCKET_NAME,
    fileHash,
    (err, stat: FullStat) => {
      if (err) {
        console.error({ err }, "Error while getting Metadata");
        return cb(err);
      }
      cb(null, stat.metaData);
    }
  );
};

const download = (file: string, cb: Function) => {
  let fileContent: string = "";
  minioClient.getObject(
    ApplicationConfiguration.MINIO_BUCKET_NAME,
    file,
    (err, dataStream) => {
      if (err || !dataStream) {
        console.error({ err }, "Error during getting file object");
        cb(err);
      } else {
        dataStream.on("data", (chunk: string) => {
          fileContent += chunk;
        });
        dataStream.on("end", async () => {
          const meta = await getMetadataAsPromised(file);

          cb(null, { data: fileContent, meta });
        });
        dataStream.on("error", function (err) {
          console.error(
            { err },
            "Error during getting file object data-stream"
          );
        });
      }
    }
  );
};

export const downloadAsPromised = (file: string): Promise<FileWithMeta> => {
  return new Promise((resolve, reject) => {
    download(file, (err, fileContent: FileWithMeta) => {
      if (err) return reject(err);

      resolve(fileContent);
    });
  });
};

export const uploadAsPromised = (
  file: string,
  content: string,
  metaData: Metadata
): Promise<string> => {
  return new Promise((resolve, reject) => {
    upload(file, content, metaData, (err) => {
      if (err) return reject(err);

      resolve(file);
    });
  });
};

const upload = (
  file: string,
  content: string,
  metaData: Metadata,
  cb: Function
) => {
  const readableStream: Stream.Readable = new Stream.Readable();
  readableStream._read = () => {};
  readableStream.push(content);
  readableStream.push(null);

  const metaDataWithName: MetadataWithName = { ...metaData, name: file };
  // Using putObject API upload your file to the bucket.
  minioClient.putObject(
    ApplicationConfiguration.MINIO_BUCKET_NAME,
    file,
    readableStream,
    getSizeInBytes(content),
    metaDataWithName,
    (err: Error) => {
      if (err) {
        console.error({ err }, "minioClient.putObject");
        return cb(err);
      }

      return cb(null);
    }
  );
};

const getSizeInBytes = (str: string): number => {
  const size = new Blob([str]).size;
  return size;
};

export const removeObject = async (documentId: string): Promise<void> => {
  return await minioClient.removeObject(
    ApplicationConfiguration.MINIO_BUCKET_NAME,
    documentId,
    function (err) {
      if (err) {
        return console.log("Unable to remove object", err);
      }
      console.log("Removed the object");
    }
  );
};
