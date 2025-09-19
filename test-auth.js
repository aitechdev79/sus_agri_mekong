const { signIn } = require('next-auth/react');

// Test admin login
async function testLogin() {
  console.log('Testing admin login...');

  // Simulate browser form submission
  const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: 'an.nguyen@example.com',
      password: 'password123',
      csrfToken: 'test-token',
      callbackUrl: 'http://localhost:3000/admin',
      json: 'true'
    }),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  const responseText = await response.text();
  console.log('Response body:', responseText);
}

testLogin().catch(console.error);