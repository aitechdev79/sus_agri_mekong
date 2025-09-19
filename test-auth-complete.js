// Test complete authentication flow
async function testCompleteAuth() {
  console.log('Testing complete admin authentication flow...');

  // First, get CSRF token
  console.log('1. Getting CSRF token...');
  const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfResponse.json();
  console.log('CSRF token:', csrfData.csrfToken);

  // Then attempt login
  console.log('2. Attempting login with admin credentials...');
  const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
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

  console.log('Login response status:', loginResponse.status);
  console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));

  const loginResult = await loginResponse.text();
  console.log('Login response body:', loginResult);

  // Check if there's a session cookie and try to get session
  const cookies = loginResponse.headers.get('set-cookie');
  if (cookies) {
    console.log('3. Cookies set:', cookies);

    // Try to get session with cookies
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
      headers: {
        'Cookie': cookies
      }
    });

    const sessionData = await sessionResponse.json();
    console.log('Session data:', sessionData);
  }
}

testCompleteAuth().catch(console.error);