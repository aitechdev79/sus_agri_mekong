const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  console.log('🔐 Resetting admin user...');

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Delete existing admin user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'admin@goodpractices.vn'
      }
    });

    // Create new admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@goodpractices.vn',
        password: hashedPassword,
        role: 'ADMIN',
        province: 'Hồ Chí Minh',
        organization: 'Good Practices Platform',
        isVerified: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: admin@goodpractices.vn`);
    console.log(`🔑 Password: admin123`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`🛡️  Role: ${adminUser.role}`);

    // Also try to update existing an.nguyen@example.com user
    const existingUser = await prisma.user.findUnique({
      where: { email: 'an.nguyen@example.com' }
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email: 'an.nguyen@example.com' },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          isVerified: true,
        }
      });
      console.log('✅ Updated existing an.nguyen@example.com user');
      console.log(`📧 Email: an.nguyen@example.com`);
      console.log(`🔑 Password: admin123`);
    } else {
      // Create the original admin user too
      await prisma.user.create({
        data: {
          name: 'Nguyễn Văn An',
          email: 'an.nguyen@example.com',
          password: hashedPassword,
          role: 'ADMIN',
          province: 'An Giang',
          organization: 'Hợp tác xã nông nghiệp An Giang',
          isVerified: true,
        },
      });
      console.log('✅ Created an.nguyen@example.com user');
      console.log(`📧 Email: an.nguyen@example.com`);
      console.log(`🔑 Password: admin123`);
    }

  } catch (error) {
    console.error('❌ Error resetting admin user:', error);
  }
}

resetAdmin()
  .catch((e) => {
    console.error('❌ Script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });