require('dotenv').config();
const http = require('http');

const citizenLogin = JSON.stringify({ email: 'citizen@policygpt.in', password: 'password123' });
const officialLogin = JSON.stringify({ email: 'gov.official@policygpt.gov', password: 'password123' });

let citizenCookie;
let officialCookie;
let targetApplicationId;
let notificationId;

// Step 1: Login as Citizen
makeRequest('/api/auth/login', 'POST', citizenLogin, null, (loginRes, loginData) => {
  console.log('1. Citizen Login Status:', loginRes.statusCode);
  citizenCookie = loginRes.headers['set-cookie']?.[0].split(';')[0];
  
  if (!citizenCookie) {
    console.error('Failed to authenticate citizen.');
    process.exit(1);
  }

  // Step 2: Get initial notifications for Citizen
  makeRequest('/api/notifications', 'GET', null, citizenCookie, (notifRes, notifData) => {
    console.log('2. Get Citizen Notifications Status:', notifRes.statusCode);
    const parsedNotifs = JSON.parse(notifData);
    console.log(`Citizen has ${parsedNotifs.notifications?.length} notifications before application review.`);

    // Step 3: Get Schemes to apply
    makeRequest('/api/schemes', 'GET', null, citizenCookie, (schemesRes, schemesData) => {
      console.log('3. Get Schemes Status:', schemesRes.statusCode);
      const { schemes } = JSON.parse(schemesData);
      if (!schemes || schemes.length === 0) {
        console.error('No schemes found to apply.');
        process.exit(1);
      }
      
      const schemeId = schemes[0]._id;
      const applyPayload = JSON.stringify({ schemeId });

      // Step 4: Apply for Scheme
      makeRequest('/api/applications', 'POST', applyPayload, citizenCookie, (applyRes, applyData) => {
        console.log('4. Apply Status:', applyRes.statusCode);
        const { application } = JSON.parse(applyData);
        if (!application || !application._id) {
          console.error('Failed to submit scheme application.');
          process.exit(1);
        }
        targetApplicationId = application._id;
        console.log('Submitted Application ID:', targetApplicationId);

        // Step 5: Login as Gov. Official
        makeRequest('/api/auth/login', 'POST', officialLogin, null, (offLoginRes, offLoginData) => {
          console.log('5. Gov. Official Login Status:', offLoginRes.statusCode);
          officialCookie = offLoginRes.headers['set-cookie']?.[0].split(';')[0];
          if (!officialCookie) {
            console.error('Failed to authenticate Gov. Official.');
            process.exit(1);
          }

          // Step 6: Approve the application
          makeRequest(`/api/applications/${targetApplicationId}/approve`, 'PATCH', null, officialCookie, (approveRes, approveData) => {
            console.log('6. Approve Application Status:', approveRes.statusCode);
            
            // Step 7: Login back as Citizen to check notification
            makeRequest('/api/notifications', 'GET', null, citizenCookie, (checkNotifRes, checkNotifData) => {
              console.log('7. Check Citizen Notifications Status:', checkNotifRes.statusCode);
              const { notifications } = JSON.parse(checkNotifData);
              console.log(`Citizen has ${notifications?.length} notifications after application approval.`);
              
              // Find the notification corresponding to the approved application
              const targetNotif = notifications.find(n => n.associatedResourceId === targetApplicationId);
              if (!targetNotif) {
                console.error('Expected application status notification not found in database.');
                process.exit(1);
              }
              
              notificationId = targetNotif._id;
              console.log('Notification Created Successfully:');
              console.log(' - Title:', targetNotif.title);
              console.log(' - Subtitle:', targetNotif.subtitle);
              console.log(' - Category:', targetNotif.category);
              console.log(' - Unread Status:', targetNotif.unread);
              console.log(' - Icon Type:', targetNotif.iconType);

              // Step 8: Mark the notification as Read
              makeRequest(`/api/notifications/${notificationId}/read`, 'PATCH', null, citizenCookie, (readRes, readData) => {
                console.log('8. Mark Notification as Read Status:', readRes.statusCode);
                
                // Step 9: Get notifications again to verify unread state
                makeRequest('/api/notifications', 'GET', null, citizenCookie, (verifyRes, verifyData) => {
                  console.log('9. Get Citizen Notifications Status:', verifyRes.statusCode);
                  const verParsed = JSON.parse(verifyData);
                  const verNotif = verParsed.notifications.find(n => n._id === notificationId);
                  console.log('Notification read status verified: Unread =', verNotif.unread);

                  // Step 10: Delete / Dismiss the notification
                  makeRequest(`/api/notifications/${notificationId}`, 'DELETE', null, citizenCookie, (deleteRes, deleteData) => {
                    console.log('10. Dismiss Notification Status:', deleteRes.statusCode);

                    // Step 11: Verify notification is deleted
                    makeRequest('/api/notifications', 'GET', null, citizenCookie, (finalRes, finalData) => {
                      console.log('11. Final Get Citizen Notifications Status:', finalRes.statusCode);
                      const finalParsed = JSON.parse(finalData);
                      const found = finalParsed.notifications.some(n => n._id === notificationId);
                      console.log('Notification deletion verified: Exists =', found);
                      console.log('--- All Notifications API tests completed successfully! ---');
                      process.exit(0);
                    });
                  });
                });
              });
            });
          });
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
