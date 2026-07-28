const Policy = require('../models/policy.model');

/**
 * @desc Create a new policy
 * @access Private (Gov. Official)
 */
const createPolicy = async (req, res, next) => {
    try {
        const { title, description, department, category } = req.body;
        
        const policy = new Policy({
            title,
            description,
            department,
            category,
            creator: req.user.id
        });

        await policy.save();

        res.status(201).json({
            success: true,
            message: 'Policy created successfully',
            policy
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get all policies
 * @access Public
 */
const getPolicies = async (req, res, next) => {
    try {
        const policies = await Policy.find().populate('creator', 'fullName email');
        res.status(200).json({ success: true, policies });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get policy by ID
 * @access Public
 */
const getPolicyById = async (req, res, next) => {
    try {
        const policy = await Policy.findById(req.params.id).populate('creator', 'fullName email');
        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }
        res.status(200).json({ success: true, policy });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Update a policy
 * @access Private (Gov. Official)
 */
const updatePolicy = async (req, res, next) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        // Only allow update if in Draft status
        if (policy.status !== 'Draft') {
            return res.status(400).json({ success: false, message: 'Only policies in Draft status can be updated' });
        }

        Object.assign(policy, req.body);
        await policy.save();

        res.status(200).json({ success: true, message: 'Policy updated successfully', policy });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Update policy status (Approve/Archive)
 * @access Private (Gov. Official)
 */
const updatePolicyStatus = async (req, res, next) => {
    try {
        const { status: newStatus } = req.body;

        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        // Self-action restriction:
        // Creators can move their own Draft to Pending.
        // They cannot perform reviewer actions (Approved/Archived) on their own work.
        const reviewerActions = ['Approved', 'Archived'];
        if (reviewerActions.includes(newStatus) && policy.creator.toString() === req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Creators cannot approve or archive their own policies' 
            });
        }

        // Workflow state transition mapping
        const allowedTransitions = {
            'Draft': ['Pending'],
            'Pending': ['Approved', 'Draft'],
            'Approved': ['Archived'],
            'Archived': []
        };

        // Validate transition
        if (!allowedTransitions[policy.status]?.includes(newStatus)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid status transition from ${policy.status} to ${newStatus}` 
            });
        }

        // Apply update
        policy.status = newStatus;
        await policy.save();

        res.status(200).json({ 
            success: true, 
            message: `Policy status updated to ${newStatus}`, 
            policy 
        });
    } catch (error) {
        next(error);
    }
};

const comparePolicies = async (req, res, next) => {
    try {
        const { id1, id2 } = req.query;
        if (!id1 || !id2) {
            return res.status(400).json({ success: false, message: 'Two policy IDs required' });
        }
        const [policy1, policy2] = await Promise.all([
            Policy.findById(id1),
            Policy.findById(id2)
        ]);
        if (!policy1 || !policy2) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }
        res.status(200).json({ success: true, comparison: { policy1, policy2 } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPolicy,
    getPolicies,
    getPolicyById,
    updatePolicy,
    updatePolicyStatus,
    comparePolicies
};
