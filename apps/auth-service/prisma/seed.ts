import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Delete existing data
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lawfirm.com',
      password: hashedPassword,
      nama_lengkap: 'Admin Utama',
      role: 'admin',
      is_active: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create advokat user
  const advokat = await prisma.user.create({
    data: {
      email: 'advokat@lawfirm.com',
      password: hashedPassword,
      nama_lengkap: 'John Doe',
      role: 'advokat',
      jabatan: 'Senior Lawyer',
      nomor_kta: 'KTA-001',
      is_active: true,
    },
  });
  console.log('✅ Advokat user created:', advokat.email);

  // Create paralegal user
  const paralegal = await prisma.user.create({
    data: {
      email: 'paralegal@lawfirm.com',
      password: hashedPassword,
      nama_lengkap: 'Jane Smith',
      role: 'paralegal',
      jabatan: 'Paralegal Staff',
      is_active: true,
    },
  });
  console.log('✅ Paralegal user created:', paralegal.email);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });