export interface IEvent<T = any> {
  pattern: string;
  data: T;
  timestamp: Date;
  service: string;
}

export interface IUserEvent {
  userId: string;
  email: string;
  nama_lengkap: string;
  role: string;
}

export interface ICaseEvent {
  caseId: string;
  nomorPerkara: string;
  clientId: string;
  status: string;
}

export interface IDocumentEvent {
  documentId: string;
  caseId: string;
  fileName: string;
  uploadedBy: string;
}

export interface ITaskEvent {
  taskId: string;
  caseId: string;
  title: string;
  assignedTo?: string;
  status: string;
}