// User Events
export const USER_EVENTS = {
  REGISTERED: 'user.registered',
  LOGGED_IN: 'user.logged_in',
  UPDATED: 'user.updated',
  DELETED: 'user.deleted',
} as const;

// Case Events
export const CASE_EVENTS = {
  CREATED: 'case.created',
  UPDATED: 'case.updated',
  STATUS_CHANGED: 'case.status_changed',
  DELETED: 'case.deleted',
} as const;

// Document Events
export const DOCUMENT_EVENTS = {
  UPLOADED: 'document.uploaded',
  DELETED: 'document.deleted',
  DOWNLOADED: 'document.downloaded',
  VERSION_CREATED: 'document.version_created',
} as const;

// Task Events
export const TASK_EVENTS = {
  CREATED: 'task.created',
  ASSIGNED: 'task.assigned',
  UPDATED: 'task.updated',
  COMPLETED: 'task.completed',
  DELETED: 'task.deleted',
} as const;