const Policy = require('../models/policy.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

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

        // Create database notifications
        try {
            // Notify policy creator
            await Notification.create({
                recipient: policy.creator,
                title: 'Policy Submitted for Approval',
                subtitle: `Your policy '${policy.title}' has been submitted.`,
                description: `The policy "${policy.title}" has been successfully submitted for approval and is currently pending review.`,
                category: 'Policy Update',
                priority: 'NORMAL',
                unread: true,
                tags: ['Policies', 'Pending'],
                source: 'System',
                department: policy.department || 'Policy Department',
                iconType: 'at',
                associatedResourceId: policy._id,
                associatedResourceType: 'Policy'
            });

            // Notify any Admin users
            const admins = await User.find({ role: 'Admin' });
            for (const admin of admins) {
                await Notification.create({
                    recipient: admin._id,
                    title: 'New Policy Pending Review',
                    subtitle: `Policy '${policy.title}' requires review.`,
                    description: `A new policy titled "${policy.title}" has been submitted by a Government Official and is pending your review and approval.`,
                    category: 'Policy Update',
                    priority: 'HIGH',
                    unread: true,
                    tags: ['Policies', 'Review Required'],
                    source: 'System',
                    department: policy.department || 'Policy Department',
                    iconType: 'landmark',
                    associatedResourceId: policy._id,
                    associatedResourceType: 'Policy'
                });
            }
        } catch (notifErr) {
            console.error('Failed to create policy submission notifications:', notifErr.message);
        }

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

        // Create database notification
        try {
            await Notification.create({
                recipient: policy.creator,
                title: 'Policy Approved',
                subtitle: `Your policy '${policy.title}' has been approved.`,
                description: `We are pleased to inform you that your policy "${policy.title}" has been reviewed and approved by the administrator. It is now live in the system.`,
                category: 'Policy Update',
                priority: 'HIGH',
                unread: true,
                tags: ['Policies', 'Approved'],
                source: 'System Admin',
                department: policy.department || 'Policy Department',
                iconType: 'check',
                associatedResourceId: policy._id,
                associatedResourceType: 'Policy'
            });
        } catch (notifErr) {
            console.error('Failed to create policy approval notification:', notifErr.message);
        }

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

        // Create database notification
        try {
            await Notification.create({
                recipient: policy.creator,
                title: 'Policy Rejected',
                subtitle: `Your policy '${policy.title}' was rejected.`,
                description: `We regret to inform you that your policy "${policy.title}" has been rejected. Reason: ${req.body.comments || 'No details provided.'}`,
                category: 'Policy Update',
                priority: 'HIGH',
                unread: true,
                tags: ['Policies', 'Rejected'],
                source: 'System Admin',
                department: policy.department || 'Policy Department',
                iconType: 'cog',
                associatedResourceId: policy._id,
                associatedResourceType: 'Policy'
            });
        } catch (notifErr) {
            console.error('Failed to create policy rejection notification:', notifErr.message);
        }

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

        // Create database notification
        try {
            await Notification.create({
                recipient: policy.creator,
                title: 'Policy Archived',
                subtitle: `Your policy '${policy.title}' has been archived.`,
                description: `The policy "${policy.title}" has been archived and is no longer active in the public listing. Reason: ${req.body.comments || 'Policy archived by administrator.'}`,
                category: 'Policy Update',
                priority: 'NORMAL',
                unread: true,
                tags: ['Policies', 'Archived'],
                source: 'System Admin',
                department: policy.department || 'Policy Department',
                iconType: 'cog',
                associatedResourceId: policy._id,
                associatedResourceType: 'Policy'
            });
        } catch (notifErr) {
            console.error('Failed to create policy archive notification:', notifErr.message);
        }

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
