const express = require('express');
const { comparePolicies, compareSchemes } = require('../controllers/comparison.controller');
const validate = require('../middlewares/validate.middleware');
const { comparePoliciesSchema, compareSchemesSchema } = require('../validations/comparison.validation');

const comparisonRouter = express.Router();

/**
 * @route POST /api/compare/policies
 * @desc Compare multiple policies side by side (2-4)
 * @access Public
 */
comparisonRouter.post('/policies', validate(comparePoliciesSchema), comparePolicies);

/**
 * @route POST /api/compare/schemes
 * @desc Compare multiple schemes side by side (2-4)
 * @access Public
 */
comparisonRouter.post('/schemes', validate(compareSchemesSchema), compareSchemes);

module.exports = comparisonRouter;
