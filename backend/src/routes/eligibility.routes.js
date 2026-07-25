const express = require('express');
const { checkEligibility } = require('../controllers/eligibility.controller');
const validate = require('../middlewares/validate.middleware');
const { checkEligibilitySchema } = require('../validations/eligibility.validation');

const eligibilityRouter = express.Router();

/**
 * @route POST /api/schemes/:id/check-eligibility
 * @desc Check eligibility for a specific scheme
 * @access Public
 */
eligibilityRouter.post('/:id/check-eligibility', validate(checkEligibilitySchema), checkEligibility);

module.exports = eligibilityRouter;
