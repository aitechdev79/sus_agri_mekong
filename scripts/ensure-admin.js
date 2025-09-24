const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function ensureAdmin() {
  console.log('🔐 Ensuring admin user exists...');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('✅ Password hashed');

    // Upsert admin user (create or update)
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@goodpractices.vn' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
      create: {
        name: 'Administrator',
        email: 'admin@goodpractices.vn',
        password: hashedPassword,
        role: 'ADMIN',
        province: 'Hồ Chí Minh',
        organization: 'Good Practices Platform',
        isVerified: true,
      },
    });

    // Also ensure the original admin exists
    const originalAdmin = await prisma.user.upsert({
      where: { email: 'an.nguyen@example.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
      create: {
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        province: 'An Giang',
        organization: 'Hợp tác xã nông nghiệp An Giang',
        isVerified: true,
      },
    });

    console.log('✅ Admin users ensured:');
    console.log(`   - ${adminUser.email} (${adminUser.role})`);
    console.log(`   - ${originalAdmin.email} (${originalAdmin.role})`);

    // Verify by fetching
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    console.log(`📊 Total admin users: ${adminCount}`);

    return { success: true, adminCount };

  } catch (error) {
    console.error('❌ Error ensuring admin user:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  ensureAdmin()
    .then((result) => {
      if (result.success) {
        console.log('✅ Admin user setup complete');
        process.exit(0);
      } else {
        console.error('❌ Admin user setup failed:', result.error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Script error:', error);
      process.exit(1);
    });
}

module.exports = { ensureAdmin };