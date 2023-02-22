import fs from "fs";

import { organizationStreamName } from "../../api/src/organization/streamNames";
import * as AsymetricCrypto from "./helper/asymmetricCrypto";
import ApplicationConfiguration from "./helper/config";
import { getStreamKeyItems } from "./helper/rpcHelper";
import { getOrganizationStreamName } from "./helper/streamHelper";
import * as SymmetricCrypto from "./helper/symmetricCrypto";
import { SecretPublishedEvent } from "./types/events";
import { Item } from "./types/item";

let sourceChain = require("multichain-node")({
  port: ApplicationConfiguration.SOURCE_RPC_PORT,
  host: ApplicationConfiguration.SOURCE_RPC_HOST,
  user: ApplicationConfiguration.SOURCE_RPC_USER,
  pass: ApplicationConfiguration.SOURCE_RPC_PASSWORD,
});

(async function () {
  try {
    //load json from docsWithoutSecret.json file
    const docsToFix: string[] = JSON.parse(
      fs.readFileSync("docsToFix.json", "utf-8")
    );
    //console.log(docsToFix);
    // docsToFix.forEach(async (doc) => {
    //   const secret = getSecret()
    //   //const
    // }); //todo do this for all docs

    const encryptedSecret = (await getSecretPublishedEvent(docsToFix[0]))
      .encryptedSecret;
    const privKey = await getPrivKey();
    const decryptedSecret = AsymetricCrypto.decryptWithKey(
      encryptedSecret,
      privKey
    );
    console.log(decryptedSecret);
    //todo save decrypted secret to file metadata on minio
  } catch (e) {
    console.log(e);
  }
})();

async function getDocumentEvents(documentId: string) {
  //only secret published events have organization key
  return await getStreamKeyItems(sourceChain, "offchain_documents", documentId);
}

async function getSecretPublishedEvent(
  documentId: string
): Promise<SecretPublishedEvent> {
  const items: Item[] = await getDocumentEvents(documentId);
  const documentUploadedEvent = items.find(
    (e) => e.data.json.type === "document_uploaded"
  );
  console.log(documentUploadedEvent);
  const fileName = (documentUploadedEvent.data.json as any).fileName;
  //todo save filename to metadata too
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
  return secretPublishedEvent as SecretPublishedEvent;
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
