import { IsEmail, IsString, IsOptional, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  nama_lengkap: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // ← UBAH KE UserRole ENUM
  
  @IsString()
  @IsOptional()
  jabatan?: string;

  @IsString()
  @IsOptional()
  nomor_kta?: string;

  @IsString()
  @IsOptional()
  telepon?: string;
}