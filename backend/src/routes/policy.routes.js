const express = require('express');
const { 
    createPolicy, 
    getPolicies, 
    getPolicyById, 
    updatePolicy, 
    updatePolicyStatus 
} = require('../controllers/policy.controller');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { 
    createPolicySchema, 
    updatePolicySchema, 
    updateStatusSchema 
} = require('../validations/policy.validation');

const policyRouter = express.Router();

/**
 * @route POST /api/policies
 * @desc Create a new policy
 * @access Private (Gov. Official)
 */
policyRouter.post('/', identifyUser, authorize(['Gov. Official', 'Super Admin']), validate(createPolicySchema), createPolicy);

/**
 * @route GET /api/policies
 * @desc Get all policies
 * @access Public
 */
policyRouter.get('/', getPolicies);

/**
 * @route GET /api/policies/:id
 * @desc Get policy by ID
 * @access Public
 */
policyRouter.get('/:id', getPolicyById);

/**
 * @route PUT /api/policies/:id
 * @desc Update a policy
 * @access Private (Gov. Official, Super Admin)
 */
policyRouter.put('/:id', identifyUser, authorize(['Gov. Official', 'Super Admin']), validate(updatePolicySchema), updatePolicy);

/**
 * @route PATCH /api/policies/:id/status
 * @desc Update policy status (Approve/Archive)
 * @access Private (Gov. Official, Super Admin)
 */
policyRouter.patch('/:id/status', identifyUser, authorize(['Gov. Official', 'Super Admin']), validate(updateStatusSchema), updatePolicyStatus);

module.exports = policyRouter;
