export interface SecretPublishedEvent {
  type: string;
  source: string;
  time: string;
  publisher: string;
  encryptedSecret: string;
  docId: string;
  organization: string;
}
