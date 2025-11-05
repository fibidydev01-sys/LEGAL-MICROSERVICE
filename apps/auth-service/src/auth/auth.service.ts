import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/database';
import { RabbitMQService } from '@app/events';
import { USER_EVENTS } from '@app/events';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
constructor(
  private prisma: PrismaService,
  private jwtService: JwtService,
  private configService: ConfigService,
  private usersService: UsersService,
  private rabbitMQService: RabbitMQService,
) {}
async register(registerDto: RegisterDto) {
  const user = await this.usersService.create(registerDto);

  const tokens = await this.generateTokens(user.id, user.email, user.role);

  // Publish event
  await this.rabbitMQService.emit(USER_EVENTS.REGISTERED, {
    userId: user.id,
    email: user.email,
    nama_lengkap: user.nama_lengkap,
    role: user.role,
    timestamp: new Date().toISOString(),
  });

  return {
    user,
    ...tokens,
  };
}

async login(loginDto: LoginDto) {
  const user = await this.usersService.findByEmailWithPassword(loginDto.email);

  if (!user) {
    throw new UnauthorizedException('Email atau password salah');
  }

  if (!user.is_active) {
    throw new UnauthorizedException('Akun Anda tidak aktif');
  }

  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Email atau password salah');
  }

  const tokens = await this.generateTokens(user.id, user.email, user.role);

  // Publish event
  await this.rabbitMQService.emit(USER_EVENTS.LOGGED_IN, {
    userId: user.id,
    email: user.email,
    nama_lengkap: user.nama_lengkap,
    role: user.role,
    timestamp: new Date().toISOString(),
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      role: user.role,
      jabatan: user.jabatan,
      nomor_kta: user.nomor_kta,
      avatar_url: user.avatar_url,
      telepon: user.telepon,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    ...tokens,
  };
}

  async refreshToken(userId: string, refreshToken: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    if (tokenRecord.user_id !== userId) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    if (new Date() > tokenRecord.expires_at) {
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new UnauthorizedException('Refresh token sudah expired');
    }

    const tokens = await this.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.email,
      tokenRecord.user.role,
    );

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (tokenRecord) {
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
    }

    return { message: 'Logout berhasil' };
  }

 async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User tidak ditemukan');
  }

  const isOldPasswordValid = await bcrypt.compare(
    changePasswordDto.old_password,
    user.password,
  );

  if (!isOldPasswordValid) {
    throw new BadRequestException('Password lama salah');
  }

  const hashedNewPassword = await bcrypt.hash(
    changePasswordDto.new_password,
    10,
  );

  await this.prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  // Delete all refresh tokens
  await this.prisma.refreshToken.deleteMany({
    where: { user_id: userId },
  });

  // Publish event
  await this.rabbitMQService.emit(USER_EVENTS.PASSWORD_CHANGED, {
    userId: user.id,
    email: user.email,
    timestamp: new Date().toISOString(),
  });

  return { message: 'Password berhasil diubah' };
}

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),  // Tanpa <string>
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),  // Tanpa <string>
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),  // Tanpa <string>
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),  // Tanpa <string>
      }),
    ]);

    // Save refresh token to database
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
    const expiresAt = new Date();
    
    // Parse expires time (e.g., "7d" -> 7 days)
    const days = parseInt(expiresIn.replace('d', ''));
    expiresAt.setDate(expiresAt.getDate() + days);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: userId,
        expires_at: expiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}