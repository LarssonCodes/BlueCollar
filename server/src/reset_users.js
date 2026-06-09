import prisma from './services/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Reset/Create Worker
  await prisma.user.upsert({
    where: { email: 'worker@test.com' },
    update: { password: passwordHash, role: 'WORKER' },
    create: {
      email: 'worker@test.com',
      password: passwordHash,
      role: 'WORKER'
    }
  });

  const workerUser = await prisma.user.findUnique({
    where: { email: 'worker@test.com' }
  });

  await prisma.workerProfile.upsert({
    where: { userId: workerUser.id },
    update: {
      fullName: 'John Worker Doe',
      phone: '9876543211',
      trade: 'PLUMBER',
      pincode: '400001',
      city: 'Mumbai',
      state: 'Maharashtra',
      experience: 3,
      bio: 'Professional plumber with years of experience',
      skills: ['piping', 'soldering']
    },
    create: {
      userId: workerUser.id,
      fullName: 'John Worker Doe',
      phone: '9876543211',
      trade: 'PLUMBER',
      pincode: '400001',
      city: 'Mumbai',
      state: 'Maharashtra',
      experience: 3,
      bio: 'Professional plumber with years of experience',
      skills: ['piping', 'soldering']
    }
  });

  // 2. Reset/Create Employer
  await prisma.user.upsert({
    where: { email: 'employer@test.com' },
    update: { password: passwordHash, role: 'EMPLOYER' },
    create: {
      email: 'employer@test.com',
      password: passwordHash,
      role: 'EMPLOYER'
    }
  });

  const employerUser = await prisma.user.findUnique({
    where: { email: 'employer@test.com' }
  });

  await prisma.employerProfile.upsert({
    where: { userId: employerUser.id },
    update: {
      fullName: 'Jane Employer Doe',
      companyName: 'Builders Corp',
      phone: '9876543210',
      pincode: '400001',
      city: 'Mumbai'
    },
    create: {
      userId: employerUser.id,
      fullName: 'Jane Employer Doe',
      companyName: 'Builders Corp',
      phone: '9876543210',
      pincode: '400001',
      city: 'Mumbai'
    }
  });

  console.log('Test accounts with fixed credentials created/reset successfully:');
  console.log('Worker: worker@test.com / Password123!');
  console.log('Employer: employer@test.com / Password123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
