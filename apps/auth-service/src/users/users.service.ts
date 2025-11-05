import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { RabbitMQService } from '@app/events';
import { USER_EVENTS } from '@app/events';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nama_lengkap: true,
        role: true,
        jabatan: true,
        nomor_kta: true,
        avatar_url: true,
        telepon: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User dengan email ${email} tidak ditemukan`);
    }

    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nama_lengkap: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { nomor_kta: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          nama_lengkap: true,
          role: true,
          jabatan: true,
          nomor_kta: true,
          avatar_url: true,
          telepon: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createUserDto: CreateUserDto) {
    // Check email exist
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Check KTA if provided
    if (createUserDto.nomor_kta) {
      const existingKta = await this.prisma.user.findUnique({
        where: { nomor_kta: createUserDto.nomor_kta },
      });

      if (existingKta) {
        throw new ConflictException('Nomor KTA sudah terdaftar');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        nama_lengkap: createUserDto.nama_lengkap,
        role: createUserDto.role as UserRole, // ← FIX: CAST TO UserRole
        jabatan: createUserDto.jabatan,
        nomor_kta: createUserDto.nomor_kta,
        telepon: createUserDto.telepon,
      },
    });

    // Remove password from response
    const { password, ...result } = user;
    return result;
  }

async update(id: string, updateUserDto: UpdateUserDto) {
  await this.findById(id);

  // Check KTA if being updated
  if (updateUserDto.nomor_kta) {
    const existingKta = await this.prisma.user.findFirst({
      where: {
        nomor_kta: updateUserDto.nomor_kta,
        NOT: { id },
      },
    });

    if (existingKta) {
      throw new ConflictException('Nomor KTA sudah digunakan');
    }
  }

  const updatedUser = await this.prisma.user.update({
    where: { id },
    data: {
      ...updateUserDto,
      role: updateUserDto.role ? (updateUserDto.role as UserRole) : undefined,
    },
    select: {
      id: true,
      email: true,
      nama_lengkap: true,
      role: true,
      jabatan: true,
      nomor_kta: true,
      avatar_url: true,
      telepon: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });

  // Publish event
  await this.rabbitMQService.emit(USER_EVENTS.UPDATED, {
    userId: updatedUser.id,
    email: updatedUser.email,
    nama_lengkap: updatedUser.nama_lengkap,
    role: updatedUser.role,
    timestamp: new Date().toISOString(),
  });

  return updatedUser;
}
async remove(id: string) {
  const user = await this.findById(id);

  await this.prisma.user.delete({
    where: { id },
    select: {
      id: true,
      email: true,
      nama_lengkap: true,
    },
  });

  // Publish event
  await this.rabbitMQService.emit(USER_EVENTS.DELETED, {
    userId: user.id,
    email: user.email,
    timestamp: new Date().toISOString(),
  });

  return { message: 'User berhasil dihapus' };
}
}