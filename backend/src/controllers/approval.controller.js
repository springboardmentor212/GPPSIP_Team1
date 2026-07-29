const Policy = require('../models/policy.model');

/**
 * @desc Submit a policy for approval (Draft → Pending)
 * @access Private (Gov. Official / Creator)
 */
const submitForApproval = async (req, res, next) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        if (policy.status !== 'Draft' && policy.status !== 'Rejected') {
            return res.status(400).json({
                success: false,
                message: `Cannot submit a policy with status "${policy.status}". Only Draft or Rejected policies can be submitted for approval.`
            });
        }

        const previousStatus = policy.status;
        policy.status = 'Pending';
        policy.approvalHistory.push({
            fromStatus: previousStatus,
            toStatus: 'Pending',
            changedBy: req.user.id,
            comments: req.body.comments || 'Submitted for approval'
        });

        await policy.save();

        res.status(200).json({
            success: true,
            message: 'Policy submitted for approval',
            policy
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Approve a policy (Pending → Approved)
 * @access Private (Gov. Official)
 */
const approvePolicy = async (req, res, next) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        if (policy.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot approve a policy with status "${policy.status}". Only Pending policies can be approved.`
            });
        }

        policy.status = 'Approved';
        policy.approvedBy = req.user.id;
        policy.reviewedBy = req.user.id;
        policy.approvalHistory.push({
            fromStatus: 'Pending',
            toStatus: 'Approved',
            changedBy: req.user.id,
            comments: req.body.comments || 'Policy approved'
        });

        await policy.save();

        res.status(200).json({
            success: true,
            message: 'Policy approved successfully',
            policy
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Reject a policy (Pending → Rejected)
 * @access Private (Gov. Official)
 */
const rejectPolicy = async (req, res, next) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        if (policy.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot reject a policy with status "${policy.status}". Only Pending policies can be rejected.`
            });
        }

        if (!req.body.comments || req.body.comments.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Rejection comments are required when rejecting a policy'
            });
        }

        policy.status = 'Rejected';
        policy.reviewedBy = req.user.id;
        policy.approvalHistory.push({
            fromStatus: 'Pending',
            toStatus: 'Rejected',
            changedBy: req.user.id,
            comments: req.body.comments
        });

        await policy.save();

        res.status(200).json({
            success: true,
            message: 'Policy rejected',
            policy
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Archive a policy (Approved → Archived)
 * @access Private (Gov. Official)
 */
const archivePolicy = async (req, res, next) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        if (policy.status !== 'Approved') {
            return res.status(400).json({
                success: false,
                message: `Cannot archive a policy with status "${policy.status}". Only Approved policies can be archived.`
            });
        }

        policy.status = 'Archived';
        policy.approvalHistory.push({
            fromStatus: 'Approved',
            toStatus: 'Archived',
            changedBy: req.user.id,
            comments: req.body.comments || 'Policy archived'
        });

        await policy.save();

        res.status(200).json({
            success: true,
            message: 'Policy archived successfully',
            policy
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get approval history for a policy
 * @access Public
 */
const getApprovalHistory = async (req, res, next) => {
    try {
        const policy = await Policy.findById(req.params.id)
            .select('title status approvalHistory')
            .populate('approvalHistory.changedBy', 'fullName email role');

        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        res.status(200).json({
            success: true,
            policyTitle: policy.title,
            currentStatus: policy.status,
            approvalHistory: policy.approvalHistory
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitForApproval,
    approvePolicy,
    rejectPolicy,
    archivePolicy,
    getApprovalHistory
};
