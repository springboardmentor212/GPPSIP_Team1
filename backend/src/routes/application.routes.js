const express = require('express');
const {
    createApplication,
    getMyApplications,
    getPendingApplications,
    getApplicationById,
    approveApplication,
    rejectApplication
} = require('../controllers/application.controller');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createApplicationSchema,
    rejectApplicationSchema
} = require('../validations/application.validation');

const applicationRouter = express.Router();

// Citizens: Create application
applicationRouter.post('/', identifyUser, authorize(['Citizen']), validate(createApplicationSchema), createApplication);

// Citizens: Get own applications
applicationRouter.get('/my', identifyUser, authorize(['Citizen']), getMyApplications);

// Gov Officials: Get pending applications
applicationRouter.get('/pending', identifyUser, authorize(['Gov. Official', 'Admin']), getPendingApplications);

// Shared: Get application details (controlled internally)
applicationRouter.get('/:id', identifyUser, getApplicationById);

// Gov Officials: Approve application
applicationRouter.patch('/:id/approve', identifyUser, authorize(['Gov. Official', 'Admin']), approveApplication);

// Gov Officials: Reject application
applicationRouter.patch('/:id/reject', identifyUser, authorize(['Gov. Official', 'Admin']), validate(rejectApplicationSchema), rejectApplication);

module.exports = applicationRouter;
