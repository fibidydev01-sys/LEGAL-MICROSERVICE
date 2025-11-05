export const USER_ROLES = {
  ADMIN: 'admin',
  ADVOKAT: 'advokat',
  PARALEGAL: 'paralegal',
  STAFF: 'staff',
  KLIEN: 'klien',
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];