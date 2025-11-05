export interface IUser {
  id: string;
  email: string;
  nama_lengkap?: string;
  role: UserRole;
  jabatan?: string;
  nomor_kta?: string;
  is_active: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  ADVOKAT = 'advokat',
  PARALEGAL = 'paralegal',
  STAFF = 'staff',
  KLIEN = 'klien',
}