const sodium = require("sodium-native");

/** Decrypts a hex-encoded ciphertext and returns the resulting string. */
export function decrypt(
  organizationSecret: string,
  hexEncodedCiphertext: string
): string {
  // The nonce/salt is prepended to the actual ciphertext:
  const dataBuffer = Buffer.from(hexEncodedCiphertext, "hex");
  const nonceBuffer = dataBuffer.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const cipherBuffer = dataBuffer.slice(sodium.crypto_secretbox_NONCEBYTES);

  const keyBuffer = toKeyBuffer(organizationSecret);

  const plaintextBuffer = Buffer.alloc(
    cipherBuffer.length - sodium.crypto_secretbox_MACBYTES
  );
  if (
    !sodium.crypto_secretbox_open_easy(
      plaintextBuffer,
      cipherBuffer,
      nonceBuffer,
      keyBuffer
    )
  ) {
    console.log("Error: decryption failed");
  }

  return plaintextBuffer.toString();
}

/** Encrypts a string and returns resulting hex-encoded ciphertext. */
export function encrypt(organizationSecret: string, plaintext: string): string {
  const plaintextBuffer = Buffer.from(plaintext);

  // The nonce/salt will be prepended to the ciphertext:
  const dataBuffer = Buffer.alloc(
    sodium.crypto_secretbox_NONCEBYTES +
      sodium.crypto_secretbox_MACBYTES +
      plaintextBuffer.length
  );

  // A new nonce/salt is used every time the vault is updated:
  const nonceBuffer = dataBuffer.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  sodium.randombytes_buf(nonceBuffer);

  const keyBuffer = toKeyBuffer(organizationSecret);

  const cipherBuffer = dataBuffer.slice(sodium.crypto_secretbox_NONCEBYTES);
  sodium.crypto_secretbox_easy(
    cipherBuffer,
    plaintextBuffer,
    nonceBuffer,
    keyBuffer
  );

  return dataBuffer.toString("hex");
}

function toKeyBuffer(secret: string): Buffer {
  const key = Buffer.alloc(sodium.crypto_secretbox_KEYBYTES);
  key.write(secret.slice(0, sodium.crypto_secretbox_KEYBYTES));

  return key;
}
