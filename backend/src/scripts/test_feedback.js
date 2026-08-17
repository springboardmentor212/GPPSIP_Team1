const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../config/db');
const User = require('../models/user.model');
const Feedback = require('../models/feedback.model');
const bcrypt = require('bcryptjs');

const PORT = 3123; // Test port to avoid port conflicts
let server;
let citizenCookie = '';
let officialCookie = '';
let testTicketId = ''; // MongoDB _id of created ticket
let testTicketNumber = ''; // #TKT-XXXX string of created ticket

const citizenLoginPayload = JSON.stringify({ email: 'citizen@policygpt.in', password: 'password123' });
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
        console.log('--- Initializing database connection and seeding users ---');
        await connectDB();

        // Ensure users exist
        let citizen = await User.findOne({ email: 'citizen@policygpt.in' });
        if (!citizen) {
            console.log('Creating test citizen...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            citizen = new User({
                fullName: 'Test Citizen',
                email: 'citizen@policygpt.in',
                mobile: '9999999991',
                dob: new Date('1990-01-01'),
                password: hashedPassword,
                state: 'Delhi',
                district: 'New Delhi',
                role: 'Citizen',
                termsAccepted: true
            });
            await citizen.save();
        }

        let official = await User.findOne({ email: 'gov.official@policygpt.gov' });
        if (!official) {
            console.log('Creating test official...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            official = new User({
                fullName: 'Test Official',
                email: 'gov.official@policygpt.gov',
                mobile: '9999999992',
                dob: new Date('1980-01-01'),
                password: hashedPassword,
                state: 'Delhi',
                district: 'Central Delhi',
                role: 'Gov. Official',
                termsAccepted: true
            });
            await official.save();
        }

        console.log('--- Starting test Express server ---');
        server = app.listen(PORT, () => {
            console.log(`Test server running on port ${PORT}`);
        });

        // 1. Login as Citizen
        console.log('\n--- Test 1: Citizen Login ---');
        const loginRes = await makeRequest('/api/auth/login', 'POST', citizenLoginPayload);
        assert(loginRes.statusCode === 200, 'Citizen login should succeed with 200 OK');
        citizenCookie = loginRes.headers['set-cookie']?.[0].split(';')[0];
        assert(!!citizenCookie, 'Should set a jwt_token cookie');

        // 2. Login as Gov. Official
        console.log('\n--- Test 2: Official Login ---');
        const offLoginRes = await makeRequest('/api/auth/login', 'POST', officialLoginPayload);
        assert(offLoginRes.statusCode === 200, 'Official login should succeed with 200 OK');
        officialCookie = offLoginRes.headers['set-cookie']?.[0].split(';')[0];
        assert(!!officialCookie, 'Should set a jwt_token cookie for official');

        // 3. Create Ticket (Validation Error Case)
        console.log('\n--- Test 3: Create Ticket with Invalid Schema ---');
        const invalidPayload = JSON.stringify({ title: 'Short', description: 'Too short', categoryTag: 'INVALID' });
        const invalidRes = await makeRequest('/api/feedback', 'POST', invalidPayload, citizenCookie);
        assert(invalidRes.statusCode === 400, 'Should fail with 400 Bad Request');
        const invalidData = JSON.parse(invalidRes.body);
        assert(invalidData.success === false, 'success flag should be false');
        assert(invalidData.message === 'Validation Error', 'Error message should indicate validation error');

        // 4. Create Ticket (Successful Case)
        console.log('\n--- Test 4: Create Ticket Success ---');
        const validPayload = JSON.stringify({
            title: 'IT System verification error',
            description: 'The digital portal keeps showing verification failure for e-certificates.',
            categoryTag: 'IT & COMM',
            priority: 'HIGH'
        });
        const createRes = await makeRequest('/api/feedback', 'POST', validPayload, citizenCookie);
        assert(createRes.statusCode === 201, 'Should succeed with 201 Created');
        const createData = JSON.parse(createRes.body);
        assert(createData.success === true, 'success should be true');
        assert(!!createData.ticket._id, 'Should return saved ticket with ID');
        assert(createData.ticket.status === 'OPEN', 'Status should default to OPEN');
        assert(createData.ticket.priority === 'HIGH', 'Priority should match input');
        assert(createData.ticket.categoryTag === 'IT & COMM', 'Category should match input');
        assert(createData.ticket.assignedDepartment === 'Min. of IT & Comm', 'Should map category to assigned department');
        assert(createData.ticket.author.fullName === 'Test Citizen', 'Should populate author full name');
        assert(createData.ticket.ticketId.startsWith('#TKT-'), 'Should generate formatted ticket ID');
        
        testTicketId = createData.ticket._id;
        testTicketNumber = createData.ticket.ticketId;

        // 5. Get Tickets as Citizen (Owner Bound)
        console.log('\n--- Test 5: Citizen List Tickets ---');
        const citizenListRes = await makeRequest('/api/feedback', 'GET', null, citizenCookie);
        assert(citizenListRes.statusCode === 200, 'Should succeed with 200 OK');
        const citizenListData = JSON.parse(citizenListRes.body);
        assert(citizenListData.tickets.length > 0, 'Citizen should see their own ticket');
        const ticketExistsInCitizenList = citizenListData.tickets.some(t => t._id === testTicketId);
        assert(ticketExistsInCitizenList, 'Citizen list should contain the created ticket');

        // 6. Get Tickets as Official (Aggregate Access with filters)
        console.log('\n--- Test 6: Official List Tickets with Filters ---');
        // Filter by status
        const offListRes1 = await makeRequest('/api/feedback?status=open', 'GET', null, officialCookie);
        assert(offListRes1.statusCode === 200, 'Should succeed with 200 OK');
        const offListData1 = JSON.parse(offListRes1.body);
        assert(offListData1.tickets.length > 0, 'Official should see tickets');
        assert(offListData1.tickets[0].status === 'OPEN', 'Filter status should restrict results');

        // Filter by category tag
        const offListRes2 = await makeRequest('/api/feedback?categoryTag=IT%20%26%20COMM', 'GET', null, officialCookie);
        assert(offListRes2.statusCode === 200, 'Should succeed with 200 OK');
        const offListData2 = JSON.parse(offListRes2.body);
        assert(offListData2.tickets.every(t => t.categoryTag === 'IT & COMM'), 'Category filter should restrict results');

        // Filter by search query (matching author name)
        const offListRes3 = await makeRequest('/api/feedback?search=Test%2520Citizen', 'GET', null, officialCookie);
        assert(offListRes3.statusCode === 200, 'Should succeed with 200 OK');
        const offListData3 = JSON.parse(offListRes3.body);
        assert(offListData3.tickets.some(t => t.author.fullName === 'Test Citizen'), 'Search filter should find matching authors');

        // 7. Get Ticket Details by ID (Citizen Owner vs Non-Owner)
        console.log('\n--- Test 7: Ticket Detail Access Control ---');
        // Citizen owner access
        const detailOwnerRes = await makeRequest(`/api/feedback/${testTicketId}`, 'GET', null, citizenCookie);
        assert(detailOwnerRes.statusCode === 200, 'Owner citizen should be allowed to view details');
        
        // Let's create a second citizen to test non-owner access
        let otherCitizen = await User.findOne({ email: 'other@policygpt.in' });
        if (!otherCitizen) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            otherCitizen = new User({
                fullName: 'Other Citizen',
                email: 'other@policygpt.in',
                mobile: '9999999993',
                dob: new Date('1992-02-02'),
                password: hashedPassword,
                state: 'Delhi',
                district: 'South Delhi',
                role: 'Citizen',
                termsAccepted: true
            });
            await otherCitizen.save();
        }
        const otherLoginPayload = JSON.stringify({ email: 'other@policygpt.in', password: 'password123' });
        const otherLoginRes = await makeRequest('/api/auth/login', 'POST', otherLoginPayload);
        const otherCookie = otherLoginRes.headers['set-cookie']?.[0].split(';')[0];

        const detailNonOwnerRes = await makeRequest(`/api/feedback/${testTicketId}`, 'GET', null, otherCookie);
        assert(detailNonOwnerRes.statusCode === 403, 'Non-owner citizen should get 403 Forbidden');

        // Official access (non-owner, but authorized role)
        const detailOfficialRes = await makeRequest(`/api/feedback/${testTicketId}`, 'GET', null, officialCookie);
        assert(detailOfficialRes.statusCode === 200, 'Official should be allowed to view details');

        // 8. Add Reply / Response as Official
        console.log('\n--- Test 8: Official Add Response ---');
        const replyPayload = JSON.stringify({ message: 'We are investigating this issue. Please try again in 10 minutes.' });
        const replyRes = await makeRequest(`/api/feedback/${testTicketId}/responses`, 'POST', replyPayload, officialCookie);
        assert(replyRes.statusCode === 200, 'Official should succeed in posting reply');
        const replyData = JSON.parse(replyRes.body);
        assert(replyData.ticket.responses.length === 1, 'Should record response in timeline');
        assert(replyData.ticket.responses[0].message === 'We are investigating this issue. Please try again in 10 minutes.', 'Message should match input');
        assert(replyData.ticket.responses[0].sender.fullName === 'Test Official', 'Should populate sender fullName');
        assert(replyData.ticket.status === 'IN PROGRESS', 'Status should auto-transition from OPEN to IN PROGRESS');

        // 9. Attempt Add Reply as Citizen (Should fail)
        console.log('\n--- Test 9: Citizen Add Response Forbidden ---');
        const citizenReplyRes = await makeRequest(`/api/feedback/${testTicketId}/responses`, 'POST', replyPayload, citizenCookie);
        assert(citizenReplyRes.statusCode === 403, 'Citizen should get 403 Forbidden when adding response');

        // 10. Update Status (Resolve) as Official
        console.log('\n--- Test 10: Official Resolve Ticket ---');
        const resolvePayload = JSON.stringify({ status: 'RESOLVED' });
        const resolveRes = await makeRequest(`/api/feedback/${testTicketId}/status`, 'PATCH', resolvePayload, officialCookie);
        assert(resolveRes.statusCode === 200, 'Official should succeed in resolving ticket');
        const resolveData = JSON.parse(resolveRes.body);
        assert(resolveData.ticket.status === 'RESOLVED', 'Ticket status should be RESOLVED');

        // 11. Attempt Resolve as Citizen (Should fail)
        console.log('\n--- Test 11: Citizen Resolve Ticket Forbidden ---');
        const citizenResolveRes = await makeRequest(`/api/feedback/${testTicketId}/status`, 'PATCH', resolvePayload, citizenCookie);
        assert(citizenResolveRes.statusCode === 403, 'Citizen should get 403 Forbidden when resolving');

        console.log('\n=======================================');
        console.log('🎉 ALL INTEGRATION TESTS PASSED CLEANLY!');
        console.log('=======================================');

    } catch (err) {
        console.error('❌ Tests aborted with error:', err.message);
        console.error(err.stack);
        process.exit(1);
    } finally {
        console.log('Cleaning up database and shutting down server...');
        if (testTicketId) {
            await Feedback.findByIdAndDelete(testTicketId);
            console.log('Test ticket deleted.');
        }
        await User.deleteOne({ email: 'other@policygpt.in' });
        console.log('Test other citizen deleted.');

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
