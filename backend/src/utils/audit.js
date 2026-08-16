const Audit = require('../models/audit.model');

/**
 * Log an administrative action to the Audit database collection
 * @param {string} action 
 * @param {string} details 
 * @param {string} userId 
 */
async function logAudit(action, details, userId) {
  try {
    const audit = new Audit({
      action,
      details,
      performedBy: userId
    });
    await audit.save();
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

module.exports = { logAudit };
