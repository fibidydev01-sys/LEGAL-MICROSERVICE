import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  old_password: string;

  @IsString()
  @MinLength(8, { message: 'Password baru minimal 8 karakter' })
  new_password: string;
}