const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Updating user passwords...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Update existing users with passwords and roles
  await prisma.user.update({
    where: { email: 'an.nguyen@example.com' },
    data: {
      password: hashedPassword,
      role: 'ADMIN'
    },
  });

  await prisma.user.update({
    where: { email: 'binh.tran@example.com' },
    data: {
      password: hashedPassword,
      role: 'USER'
    },
  });

  console.log('✅ User passwords updated successfully!');
  console.log('👤 Admin: an.nguyen@example.com / password123');
  console.log('👤 User: binh.tran@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error updating passwords:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });