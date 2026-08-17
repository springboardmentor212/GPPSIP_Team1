const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../config/db');

const PORT = 3124; // Test port to avoid conflicts
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

        // 2. Fetch KPIs
        console.log('\n--- Test 2: Fetch Analytics KPIs ---');
        const kpisRes = await makeRequest('/api/analytics/kpis', 'GET', null, officialCookie);
        assert(kpisRes.statusCode === 200, 'GET /api/analytics/kpis should succeed with 200 OK');
        const kpisData = JSON.parse(kpisRes.body);
        assert(kpisData.success === true, 'success flag should be true');
        assert(typeof kpisData.kpis.totalPolicies === 'number', 'totalPolicies should be a number');
        assert(typeof kpisData.kpis.totalSchemes === 'number', 'totalSchemes should be a number');
        assert(typeof kpisData.kpis.totalApplications === 'number', 'totalApplications should be a number');
        assert(typeof kpisData.kpis.approvalRate === 'number', 'approvalRate should be a number');
        assert(typeof kpisData.kpis.activeUsers === 'number', 'activeUsers should be a number');
        assert(typeof kpisData.kpis.avgProcessingTime === 'number', 'avgProcessingTime should be a number');
        assert(typeof kpisData.kpis.citizenReach === 'number', 'citizenReach should be a number');
        assert(typeof kpisData.kpis.monthlySearches === 'number', 'monthlySearches should be a number');

        // 3. Fetch Trends
        console.log('\n--- Test 3: Fetch Analytics Trends ---');
        const trendsRes = await makeRequest('/api/analytics/trends', 'GET', null, officialCookie);
        assert(trendsRes.statusCode === 200, 'GET /api/analytics/trends should succeed with 200 OK');
        const trendsData = JSON.parse(trendsRes.body);
        assert(trendsData.success === true, 'success should be true');
        assert(Array.isArray(trendsData.trends), 'trends should be an array');
        if (trendsData.trends.length > 0) {
            const firstTrend = trendsData.trends[0];
            assert(typeof firstTrend.month === 'string', 'trend month should be a string');
            assert(typeof firstTrend.year === 'number', 'trend year should be a number');
            assert(typeof firstTrend.policies === 'number', 'trend policies count should be a number');
            assert(typeof firstTrend.schemes === 'number', 'trend schemes count should be a number');
        }

        // 4. Fetch Departments Index
        console.log('\n--- Test 4: Fetch Departmental Analytics ---');
        const deptsRes = await makeRequest('/api/analytics/departments', 'GET', null, officialCookie);
        assert(deptsRes.statusCode === 200, 'GET /api/analytics/departments should succeed with 200 OK');
        const deptsData = JSON.parse(deptsRes.body);
        assert(deptsData.success === true, 'success should be true');
        assert(Array.isArray(deptsData.departments), 'departments should be an array');
        if (deptsData.departments.length > 0) {
            const dept = deptsData.departments[0];
            assert(typeof dept.rank === 'number', 'department rank should be a number');
            assert(typeof dept.name === 'string', 'department name should be a string');
            assert(typeof dept.policies === 'number', 'department policies count should be a number');
            assert(typeof dept.schemes === 'number', 'department schemes count should be a number');
            assert(typeof dept.approval === 'number', 'department approval rate should be a number');
            assert(typeof dept.approvalUp === 'boolean', 'department approvalUp should be a boolean');
            assert(typeof dept.reach === 'string', 'department reach should be a string');
            assert(typeof dept.avgProcessDays === 'number', 'department avgProcessDays should be a number');
        }

        // 5. Access Control Test (Forbidden for unauthorized requests)
        console.log('\n--- Test 5: Access Control Enforcement ---');
        const noAuthRes = await makeRequest('/api/analytics/kpis', 'GET', null, null);
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
