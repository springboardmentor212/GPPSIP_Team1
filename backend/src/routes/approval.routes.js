const express = require('express');
const {
    submitForApproval,
    approvePolicy,
    rejectPolicy,
    archivePolicy,
    getApprovalHistory
} = require('../controllers/approval.controller');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { approvalActionSchema, rejectPolicySchema } = require('../validations/approval.validation');

const approvalRouter = express.Router();

/**
 * @route PATCH /api/policies/:id/submit
 * @desc Submit policy for approval (Draft/Rejected → Pending)
 * @access Private (Gov. Official)
 */
approvalRouter.patch('/:id/submit', identifyUser, authorize(['Gov. Official']), validate(approvalActionSchema), submitForApproval);

/**
 * @route PATCH /api/policies/:id/approve
 * @desc Approve a policy (Pending → Approved)
 * @access Private (Gov. Official)
 */
approvalRouter.patch('/:id/approve', identifyUser, authorize(['Gov. Official']), validate(approvalActionSchema), approvePolicy);

/**
 * @route PATCH /api/policies/:id/reject
 * @desc Reject a policy (Pending → Rejected)
 * @access Private (Gov. Official)
 */
approvalRouter.patch('/:id/reject', identifyUser, authorize(['Gov. Official']), validate(rejectPolicySchema), rejectPolicy);

/**
 * @route PATCH /api/policies/:id/archive
 * @desc Archive a policy (Approved → Archived)
 * @access Private (Gov. Official)
 */
approvalRouter.patch('/:id/archive', identifyUser, authorize(['Gov. Official']), validate(approvalActionSchema), archivePolicy);

/**
 * @route GET /api/policies/:id/approval-history
 * @desc Get full approval audit trail for a policy
 * @access Public
 */
approvalRouter.get('/:id/approval-history', getApprovalHistory);

module.exports = approvalRouter;
