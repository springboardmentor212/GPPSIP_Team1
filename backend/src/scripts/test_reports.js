const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../config/db');

const PORT = 3125; // Separate port to avoid conflicts
let server;
let officialCookie = '';

const officialLoginPayload = JSON.stringify({ email: 'gov.official@policygpt.gov', password: 'password123' });

// Request Helper
function makeRequest(path, method, payload, cookie) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
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
                resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

// Assert Helper
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        throw new Error(`Assertion failed: ${message}`);
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

async function runTests() {
    try {
        console.log('--- Initializing database connection (Read-Only) ---');
        await connectDB();

        console.log('--- Starting test Express server ---');
        server = app.listen(PORT, () => {
            console.log(`Test server running on port ${PORT}`);
        });

        console.log('\n--- Test 1: Official Login ---');
        const loginRes = await makeRequest('/api/auth/login', 'POST', officialLoginPayload);
        if (loginRes.statusCode !== 200) {
            console.warn('⚠️ Warning: Login failed. Make sure the database is seeded by running "npm run seed" first.');
            assert(loginRes.statusCode === 200, 'Official login should succeed with 200 OK');
        }
        
        officialCookie = loginRes.headers['set-cookie']?.[0].split(';')[0];
        assert(!!officialCookie, 'Should set a jwt_token cookie');

        // 2. Fetch Reports list
        console.log('\n--- Test 2: Fetch Reports List ---');
        const reportsRes = await makeRequest('/api/reports', 'GET', null, officialCookie);
        assert(reportsRes.statusCode === 200, 'GET /api/reports should succeed with 200 OK');
        const reportsData = JSON.parse(reportsRes.body);
        assert(reportsData.success === true, 'success flag should be true');
        assert(Array.isArray(reportsData.reports), 'reports should be an array');
        if (reportsData.reports.length > 0) {
            const r = reportsData.reports[0];
            assert(typeof r.reportId === 'string', 'reportId should be a string');
            assert(typeof r.name === 'string', 'report name should be a string');
            assert(typeof r.format === 'string', 'report format should be a string');
            assert(typeof r.status === 'string', 'report status should be a string');
        }

        // 3. Fetch Schedules list
        console.log('\n--- Test 3: Fetch Report Schedules ---');
        const schedulesRes = await makeRequest('/api/reports/schedules', 'GET', null, officialCookie);
        assert(schedulesRes.statusCode === 200, 'GET /api/reports/schedules should succeed with 200 OK');
        const schedulesData = JSON.parse(schedulesRes.body);
        assert(schedulesData.success === true, 'success flag should be true');
        assert(Array.isArray(schedulesData.schedules), 'schedules should be an array');
        if (schedulesData.schedules.length > 0) {
            const s = schedulesData.schedules[0];
            assert(typeof s.reportId === 'string', 'schedule reportId should be a string');
            assert(typeof s.name === 'string', 'schedule name should be a string');
            assert(s.isScheduled === true, 'isScheduled flag should be true');
        }

        // 4. Access Control
        console.log('\n--- Test 4: Access Control Enforcement ---');
        const noAuthRes = await makeRequest('/api/reports', 'GET', null, null);
        assert(noAuthRes.statusCode === 401, 'Request without token should fail with 401 Unauthorized');

        console.log('\n=======================================');
        console.log('🎉 READ-ONLY INTEGRATION TESTS PASSED!');
        console.log('=======================================');

    } catch (err) {
        console.error('❌ Tests failed:', err.message);
        process.exit(1);
    } finally {
        console.log('Shutting down server...');
        if (server) {
            server.close();
            console.log('Express server closed.');
        }
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
        process.exit(0);
    }
}

runTests();
