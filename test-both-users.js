// Test both admin users
async function testBothUsers() {
  console.log('Testing both admin users...');

  // First get CSRF token
  const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfResponse.json();
  console.log('CSRF token:', csrfData.csrfToken);

  // Test user 1: from create-admin script
  console.log('\n1. Testing admin@goodpractices.local / admin123...');
  const loginResponse1 = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: 'admin@goodpractices.local',
      password: 'admin123',
      csrfToken: csrfData.csrfToken,
      callbackUrl: 'http://localhost:3000/admin',
      json: 'true'
    }),
  });

  const result1 = await loginResponse1.text();
  console.log('Result:', result1);

  // Test user 2: from seed script
  console.log('\n2. Testing an.nguyen@example.com / password123...');
  const loginResponse2 = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: 'an.nguyen@example.com',
      password: 'password123',
      csrfToken: csrfData.csrfToken,
      callbackUrl: 'http://localhost:3000/admin',
      json: 'true'
    }),
  });

  const result2 = await loginResponse2.text();
  console.log('Result:', result2);
}

testBothUsers().catch(console.error);