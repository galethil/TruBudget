import * as crypto from "crypto";

export function encryptWithKey(toEncrypt, publicKey): string {
  try {
    const buffer = Buffer.from(toEncrypt, "utf8");
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
  } catch (error) {
    console.log("Encryption failed");
  }
}

export function decryptWithKey(toDecrypt, privateKey): string {
  try {
    const buffer = Buffer.from(toDecrypt, "base64");
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey.toString(),
        passphrase: "",
      },
      buffer
    );
    return decrypted.toString("utf8");
  } catch (error) {
    console.log(error);
    console.log("Decryption failed");
  }
}
