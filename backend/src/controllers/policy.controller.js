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

        // Access Control: Only Creator or Super Admin can update
        if (policy.creator.toString() !== req.user.id && req.user.role !== 'Super Admin') {
            return res.status(403).json({ success: false, message: 'Forbidden: You can only update policies you created' });
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
        const { status } = req.body;
        const policy = await Policy.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!policy) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }

        res.status(200).json({ success: true, message: `Policy status updated to ${status}`, policy });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPolicy,
    getPolicies,
    getPolicyById,
    updatePolicy,
    updatePolicyStatus
};
