const express = require('express');
const {
    getKPIs,
    getTrends,
    getDepartmentAnalytics
} = require('../controllers/analytics.controller');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { getAnalyticsSchema } = require('../validations/analytics.validation');

const analyticsRouter = express.Router();

/**
 * @route GET /api/analytics/kpis
 * @desc Get Key Performance Indicators (KPIs)
 * @access Private (Officials only)
 */
analyticsRouter.get('/kpis', identifyUser, authorize(['Gov. Official', 'Admin']), validate(getAnalyticsSchema), getKPIs);

/**
 * @route GET /api/analytics/trends
 * @desc Get Policy & Scheme Growth Trends (Monthly)
 * @access Private (Officials only)
 */
analyticsRouter.get('/trends', identifyUser, authorize(['Gov. Official', 'Admin']), validate(getAnalyticsSchema), getTrends);

/**
 * @route GET /api/analytics/departments
 * @desc Get Departmental Performance Index
 * @access Private (Officials only)
 */
analyticsRouter.get('/departments', identifyUser, authorize(['Gov. Official', 'Admin']), validate(getAnalyticsSchema), getDepartmentAnalytics);

module.exports = analyticsRouter;
