const https = require("https");
const http = require("http");

async function testSignIn() {
  console.log("🧪 Testing NextAuth signin API...");

  const postData = JSON.stringify({
    email: "admin@goodpractices.local",
    password: "admin123",
    redirect: false
  });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/api/auth/signin/credentials",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log("Response:", data);
        resolve(data);
      });
    });

    req.on("error", (e) => {
      console.error(`Request error: ${e.message}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

testSignIn().catch(console.error);
