require('dotenv').config();
const http = require('http');

const citizenLogin = JSON.stringify({ email: 'citizen@policygpt.in', password: 'password123' });
const officialLogin = JSON.stringify({ email: 'gov.official@policygpt.gov', password: 'password123' });

// Step 1: Login as Citizen
makeRequest('/api/auth/login', 'POST', citizenLogin, null, (loginRes, loginData) => {
  console.log('Citizen Login Status:', loginRes.statusCode);
  const citizenCookie = loginRes.headers['set-cookie']?.[0].split(';')[0];
  
  if (!citizenCookie) {
    console.error('Failed to get citizen cookie');
    process.exit(1);
  }

  // Step 2: Get Schemes
  makeRequest('/api/schemes', 'GET', null, citizenCookie, (schemesRes, schemesData) => {
    console.log('Get Schemes Status:', schemesRes.statusCode);
    const { schemes } = JSON.parse(schemesData);
    
    if (!schemes || schemes.length === 0) {
      console.error('No schemes found');
      process.exit(1);
    }
    
    const schemeId = schemes[0]._id;
    console.log('Selected Scheme ID:', schemeId);

    // Step 3: Apply for Scheme
    const applyPayload = JSON.stringify({ schemeId });
    makeRequest('/api/applications', 'POST', applyPayload, citizenCookie, (applyRes, applyData) => {
      console.log('Apply Status:', applyRes.statusCode);
      console.log('Apply Body:', applyData);

      // Step 4: Login as Official
      makeRequest('/api/auth/login', 'POST', officialLogin, null, (offLoginRes, offLoginData) => {
        console.log('Official Login Status:', offLoginRes.statusCode);
        const officialCookie = offLoginRes.headers['set-cookie']?.[0].split(';')[0];

        if (!officialCookie) {
          console.error('Failed to get official cookie');
          process.exit(1);
        }

        // Step 5: Get Pending applications
        makeRequest('/api/applications/pending?status=All', 'GET', null, officialCookie, (pendingRes, pendingData) => {
          console.log('Official Get Pending Status:', pendingRes.statusCode);
          const parsed = JSON.parse(pendingData);
          console.log('Total applications found in official list:', parsed.applications?.length);
          console.log('Applications details:', JSON.stringify(parsed.applications, null, 2));
          process.exit(0);
        });
      });
    });
  });
});

function makeRequest(path, method, payload, cookie, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: method,
    headers: {}
  };

  if (payload) {
    options.headers['Content-Type'] = 'application/json';
    options.headers['Content-Length'] = Buffer.byteLength(payload);
  }

  if (cookie) {
    options.headers['Cookie'] = cookie;
  }

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      callback(res, data);
    });
  });

  req.on('error', (e) => {
    console.error(`Request to ${path} failed:`, e.message);
  });

  if (payload) {
    req.write(payload);
  }
  req.end();
}
