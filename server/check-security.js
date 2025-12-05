const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
  // Check for Helmet headers
  if (res.headers['x-dns-prefetch-control'] && res.headers['x-frame-options']) {
    console.log('SUCCESS: Security headers detected.');
  } else {
    console.log('FAILURE: Security headers missing.');
  }

  // Check for Rate Limit headers
  if (res.headers['x-ratelimit-limit']) {
      console.log('SUCCESS: Rate limit headers detected.');
  } else {
      console.log('FAILURE: Rate limit headers missing.');
  }
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(JSON.stringify({ email: 'test@test.com', password: 'test' }));
req.end();
