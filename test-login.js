const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function simulateLogin() {
  try {
    console.log('🧪 Simulating login process...');

    const credentials = {
      email: 'admin@goodpractices.local',
      password: 'admin123'
    };

    console.log('1️⃣ Checking credentials...');
    console.log('   Email:', credentials.email);
    console.log('   Password: [hidden]');

    if (!credentials.email || !credentials.password) {
      console.log('❌ Missing credentials');
      return;
    }

    console.log('2️⃣ Finding user in database...');
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      console.log('❌ User not found:', credentials.email);
      return;
    }

    console.log('✅ User found:', user.email, 'Role:', user.role);

    console.log('3️⃣ Verifying password...');
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '');

    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', credentials.email);
      return;
    }

    console.log('✅ Password verified successfully');

    console.log('4️⃣ Creating user object for NextAuth...');
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    console.log('✅ Auth user object:', JSON.stringify(authUser, null, 2));
    console.log('🎉 Login simulation successful!');

  } catch (error) {
    console.error('❌ Simulation error:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

simulateLogin();