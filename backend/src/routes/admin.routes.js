const express = require('express');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const {
  getUsers,
  toggleUserStatus,
  deleteUser,
  getApplications,
  getAuditLogs,
  getStats,
  getSettings,
  updateSettings
} = require('../controllers/admin.controller');

const adminRouter = express.Router();

// Apply auth protection & Super Admin role-based check globally to all admin routes
adminRouter.use(identifyUser);
adminRouter.use(authorize(['Super Admin']));

// User management routes
adminRouter.get('/users', getUsers);
adminRouter.patch('/users/:id/status', toggleUserStatus);
adminRouter.delete('/users/:id', deleteUser);

// Oversight applications routes
adminRouter.get('/applications', getApplications);

// System Audit Logs routes
adminRouter.get('/audit-logs', getAuditLogs);

// System KPIs routes
adminRouter.get('/stats', getStats);

// Settings routes
adminRouter.get('/settings', getSettings);
adminRouter.post('/settings', updateSettings);

module.exports = adminRouter;
