import * as fs from "fs";

import { organizationStreamName } from "../../api/src/organization/streamNames";
import { fixEvents } from "./fixEvents";
import { fixMetadata } from "./fixMetadata";
import * as AsymetricCrypto from "./helper/asymmetricCrypto";
import ApplicationConfiguration from "./helper/config";
import { getStreamKeyItems } from "./helper/rpcHelper";
import { getOrganizationStreamName } from "./helper/streamHelper";
import * as SymmetricCrypto from "./helper/symmetricCrypto";
import {
  PublicKeyPublishedEvent,
  SecretPublishedEvent,
  WorkflowitemDocumentUploadedEvent,
} from "./types/events";
import { Item } from "./types/item";

let sourceChain = require("multichain-node")({
  port: ApplicationConfiguration.SOURCE_RPC_PORT,
  host: ApplicationConfiguration.SOURCE_RPC_HOST,
  user: ApplicationConfiguration.SOURCE_RPC_USER,
  pass: ApplicationConfiguration.SOURCE_RPC_PASSWORD,
});

(async function () {
  try {
    const docsToFix: string[] = JSON.parse(
      fs.readFileSync("docsToFix.json", "utf-8")
    );
    //await fixMissingMetadata(docsToFix);
    await fixEventsAndMetadata(docsToFix);
  } catch (e) {
    console.log(e);
  }
})();

async function fixMissingMetadata(docsToFix: string[]) {
  const documentsWithProblems = [];

  for (const docId of docsToFix) {
    const { encryptedSecret, fileName } = await getFileInfo(docId);

    if (!encryptedSecret && !fileName) {
      console.log(`Document is not uploaded correctly ${docId}`);
      documentsWithProblems.push(docId);
      continue;
    }

    const privKey = await getPrivKey();
    const decryptedSecret = AsymetricCrypto.decryptWithKey(
      encryptedSecret,
      privKey
    );
    console.log(decryptedSecret);
    await fixMetadata(docId, fileName, decryptedSecret);
  }
  console.log("following docs could not be fixed:");
  console.log(documentsWithProblems);
}

async function fixEventsAndMetadata(docsToFix: string[]) {
  const documentsWithProblems = [];
  // for (const docId of docsToFix) {
  const docId = ""; //todo enter id here
  const items: Item[] = await getDocumentEvents(docId);
  const workflowitemDocumentUploadedEvent = items.find(
    (e) => e.data.json.type === "workflowitem_document_uploaded"
  );
  if (!workflowitemDocumentUploadedEvent) {
    console.log(`Event is not saved for this documentId ${docId}`);
    // continue;
  }
  const event: WorkflowitemDocumentUploadedEvent =
    workflowitemDocumentUploadedEvent.data
      .json as WorkflowitemDocumentUploadedEvent;
  console.log(event);

  const publicKeyBase64 = await getPubKey();
  await fixEvents(event, publicKeyBase64, sourceChain);

  // }
  console.log("following docs could not be fixed:");
  console.log(documentsWithProblems);
}

async function getDocumentEvents(documentId: string) {
  //only secret published events have organization key
  return await getStreamKeyItems(sourceChain, "offchain_documents", documentId);
}

async function getFileInfo(
  documentId: string
): Promise<{ encryptedSecret: string; fileName: string }> {
  const items: Item[] = await getDocumentEvents(documentId);
  const documentUploadedEvent = items.find(
    (e) => e.data.json.type === "document_uploaded"
  );
  if (!documentUploadedEvent) return { encryptedSecret: "", fileName: "" }; // this document is not saved correctly

  const fileName = (documentUploadedEvent.data.json as any).fileName;

  if (!documentUploadedEvent) {
    console.log(`Document is not uploaded for this documentId ${documentId}`);
  }
  const secretPublishedEvent = items.find(
    (e) =>
      e.data.json.type === "secret_published" &&
      (e.data.json as SecretPublishedEvent).organization ===
        ApplicationConfiguration.ORGANIZATION
  ).data.json;

  if (!secretPublishedEvent) {
    console.log("Secret is not published for this organization");
  }
  return {
    encryptedSecret: (secretPublishedEvent as SecretPublishedEvent)
      .encryptedSecret,
    fileName,
  };
}

async function getPrivKey() {
  const organizationStreamName = getOrganizationStreamName(
    ApplicationConfiguration.ORGANIZATION
  );

  const encryptedPrivkeyItems = await getStreamKeyItems(
    sourceChain,
    organizationStreamName,
    "privateKey"
  );

  const decryptedPrivkey = SymmetricCrypto.decrypt(
    ApplicationConfiguration.ORGANIZATION_VAULT_SECRET,
    (encryptedPrivkeyItems[0].data.json as any).privateKey
  );

  return decryptedPrivkey;
}

async function getPubKey(): Promise<string> {
  const publicKeyItem = await getStreamKeyItems(
    sourceChain,
    "public_keys",
    ApplicationConfiguration.ORGANIZATION
  );
  return (publicKeyItem[0].data.json as PublicKeyPublishedEvent).publicKey;
}
