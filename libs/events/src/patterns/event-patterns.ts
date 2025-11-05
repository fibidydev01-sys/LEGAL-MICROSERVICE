// User Events
export const USER_EVENTS = {
  REGISTERED: 'user.registered',
  LOGGED_IN: 'user.logged_in',
  UPDATED: 'user.updated',
  DELETED: 'user.deleted',
  PASSWORD_CHANGED: 'user.password_changed',
} as const;

// Case Events
export const CASE_EVENTS = {
  CREATED: 'case.created',
  UPDATED: 'case.updated',
  STATUS_CHANGED: 'case.status_changed',
  DELETED: 'case.deleted',
  TEAM_MEMBER_ADDED: 'case.team_member_added',
  TEAM_MEMBER_REMOVED: 'case.team_member_removed',
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

// Hearing Events
export const HEARING_EVENTS = {
  SCHEDULED: 'hearing.scheduled',
  UPDATED: 'hearing.updated',
  CANCELLED: 'hearing.cancelled',
  COMPLETED: 'hearing.completed',
} as const;

export type UserEventType = typeof USER_EVENTS[keyof typeof USER_EVENTS];
export type CaseEventType = typeof CASE_EVENTS[keyof typeof CASE_EVENTS];
export type DocumentEventType = typeof DOCUMENT_EVENTS[keyof typeof DOCUMENT_EVENTS];
export type TaskEventType = typeof TASK_EVENTS[keyof typeof TASK_EVENTS];
export type HearingEventType = typeof HEARING_EVENTS[keyof typeof HEARING_EVENTS];