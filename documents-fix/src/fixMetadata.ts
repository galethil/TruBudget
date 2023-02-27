import { downloadAsPromised, uploadAsPromised } from "./minioClient";

export const fixMetadata = async (
  docId: string,
  fileName: string,
  secret: string
) => {
  const metadata = {
    fileName,
    secret,
    docId,
  };

  const document = await downloadAsPromised(docId);

  const uploadResult = await uploadAsPromised(docId, document.data, {
    fileName,
    docId,
    secret,
  });
};
