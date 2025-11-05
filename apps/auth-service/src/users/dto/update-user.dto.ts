import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  nama_lengkap?: string;

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