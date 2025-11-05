import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  ADVOKAT = 'advokat',
  PARALEGAL = 'paralegal',
  STAFF = 'staff',
  KLIEN = 'klien',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsString()
  @MinLength(3, { message: 'Nama lengkap minimal 3 karakter' })
  nama_lengkap: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role tidak valid' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  jabatan?: string;

  @IsOptional()
  @IsString()
  nomor_kta?: string;

  @IsOptional()
  @IsString()
  telepon?: string;
}