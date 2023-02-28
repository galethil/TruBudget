import uuid = require("uuid");

import * as AsymetricCrypto from "./helper/asymmetricCrypto";
import ApplicationConfiguration from "./helper/config";
import { createStreamItem } from "./helper/rpcHelper";
import {
  DocumentUploadedEvent,
  SecretPublishedEvent,
  WorkflowitemDocumentUploadedEvent,
} from "./types/events";

export const fixEvents = async (
  event: WorkflowitemDocumentUploadedEvent,
  pubKeyBase64: string,
  multichain: any
) => {
  const documentUploadedEvent: DocumentUploadedEvent = {
    type: "document_uploaded",
    source: event.source,
    time: new Date().toISOString(),
    publisher: event.publisher,
    docId: event.document.id,
    fileName: event.document.fileName,
    organization: ApplicationConfiguration.ORGANIZATION,
  };

  const newSecret = uuid.v4();
  const publicBuff = Buffer.from(pubKeyBase64, "base64");
  const publicKey = publicBuff.toString("utf8");

  const encryptedSecret = AsymetricCrypto.encryptWithKey(newSecret, publicKey);

  const secretPublishedEvent: SecretPublishedEvent = {
    type: "secret_published",
    source: event.source,
    time: new Date().toISOString(),
    publisher: event.publisher,
    encryptedSecret,
    docId: event.document.id,
    organization: ApplicationConfiguration.ORGANIZATION,
  };
  console.log(documentUploadedEvent, secretPublishedEvent);
  // todo save docs in chain
  await createStreamItem(
    multichain,
    "offchain_documents",
    [event.document.id],
    documentUploadedEvent
  );
  await createStreamItem(
    multichain,
    "offchain_documents",
    [event.document.id, ApplicationConfiguration.ORGANIZATION],
    secretPublishedEvent
  );
};
