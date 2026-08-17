const express = require('express');
const {
    exportReport,
    scheduleReport,
    getReports,
    getSchedules,
    deleteSchedule,
    downloadReport
} = require('../controllers/report.controller');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { exportReportSchema, scheduleReportSchema } = require('../validations/report.validation');

const reportRouter = express.Router();

/**
 * All reports routes are protected and limited to Gov. Officials & Admin
 */
reportRouter.use(identifyUser, authorize(['Gov. Official', 'Admin']));

reportRouter.post('/export', validate(exportReportSchema), exportReport);
reportRouter.post('/schedule', validate(scheduleReportSchema), scheduleReport);
reportRouter.get('/', getReports);
reportRouter.get('/schedules', getSchedules);
reportRouter.delete('/schedules/:id', deleteSchedule);
reportRouter.get('/download/:id', downloadReport);

module.exports = reportRouter;
