export interface SecretPublishedEvent {
  type: "secret_published";
  source: string;
  time: string;
  publisher: string;
  encryptedSecret: string;
  docId: string;
  organization: string;
}

export interface WorkflowitemDocumentUploadedEvent {
  type: "workflowitem_document_uploaded";
  source: string;
  publisher: string;
  projectId: string;
  subprojectId: string;
  workflowitemId: string;
  document: {
    base64: string;
    fileName: string;
    id: string;
    url: string;
  };
  time: string;
}

export interface DocumentUploadedEvent {
  type: "document_uploaded";
  source: string;
  time: string; // ISO timestamp
  publisher: string;
  docId: string;
  fileName: string;
  organization: string;
}

export interface PublicKeyPublishedEvent {
  type: "public_key_published";
  source: string;
  time: string; // ISO timestamp
  publisher: string;
  organization: string;
  publicKey: string;
}
