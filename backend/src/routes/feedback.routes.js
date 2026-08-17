const express = require('express');
const {
    createFeedback,
    getFeedback,
    getFeedbackById,
    addResponse,
    updateStatus
} = require('../controllers/feedback.controller');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createFeedbackSchema,
    addResponseSchema,
    updateFeedbackStatusSchema
} = require('../validations/feedback.validation');

const feedbackRouter = express.Router();

/**
 * @route POST /api/feedback
 * @desc Create a new support ticket
 * @access Private (Citizen, Researcher/NGO, Gov. Official)
 */
feedbackRouter.post('/', identifyUser, validate(createFeedbackSchema), createFeedback);

/**
 * @route GET /api/feedback
 * @desc Get feedback tickets list
 * @access Private (All roles; results bounded by owner/filters)
 */
feedbackRouter.get('/', identifyUser, getFeedback);

/**
 * @route GET /api/feedback/:id
 * @desc Get details of a specific ticket
 * @access Private (All roles; owner-bound for non-officials)
 */
feedbackRouter.get('/:id', identifyUser, getFeedbackById);

/**
 * @route POST /api/feedback/:id/responses
 * @desc Add a response message to a ticket
 * @access Private (Gov. Officials / Admin only)
 */
feedbackRouter.post('/:id/responses', identifyUser, authorize(['Gov. Official', 'Admin']), validate(addResponseSchema), addResponse);

/**
 * @route PATCH /api/feedback/:id/status
 * @desc Update the status of a ticket
 * @access Private (Gov. Officials / Admin only)
 */
feedbackRouter.patch('/:id/status', identifyUser, authorize(['Gov. Official', 'Admin']), validate(updateFeedbackStatusSchema), updateStatus);

module.exports = feedbackRouter;
