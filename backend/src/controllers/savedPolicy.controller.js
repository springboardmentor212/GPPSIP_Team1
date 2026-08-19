const SavedPolicy = require('../models/savedPolicy.model');

/**
 * @desc Save/bookmark a policy
 * @route POST /api/saved-policies
 * @access Private
 */
const savePolicy = async (req, res, next) => {
    try {
        const { policyId } = req.body;
        const userId = req.user.id;

        if (!policyId) {
            return res.status(400).json({ success: false, message: 'policyId is required' });
        }

        // Check if already saved
        const existing = await SavedPolicy.findOne({ user: userId, policy: policyId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Policy already saved' });
        }

        const saved = new SavedPolicy({ user: userId, policy: policyId });
        await saved.save();

        res.status(201).json({ success: true, message: 'Policy saved successfully', savedPolicy: saved });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get all saved policies for current user
 * @route GET /api/saved-policies
 * @access Private
 */
const getSavedPolicies = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const savedPolicies = await SavedPolicy.find({ user: userId })
            .populate({
                path: 'policy',
                populate: { path: 'creator', select: 'fullName email' }
            })
            .sort({ createdAt: -1 });

        // Filter out any where the policy was deleted
        const policies = savedPolicies
            .filter(sp => sp.policy !== null)
            .map(sp => ({
                _id: sp._id,
                savedAt: sp.createdAt,
                ...sp.policy.toObject()
            }));

        res.status(200).json({ success: true, policies });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Remove a saved/bookmarked policy
 * @route DELETE /api/saved-policies/:policyId
 * @access Private
 */
const removeSavedPolicy = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const policyId = req.params.policyId;

        const deleted = await SavedPolicy.findOneAndDelete({ user: userId, policy: policyId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Saved policy not found' });
        }

        res.status(200).json({ success: true, message: 'Policy removed from saved list' });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Check if a policy is saved by current user
 * @route GET /api/saved-policies/check/:policyId
 * @access Private
 */
const checkSavedPolicy = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const policyId = req.params.policyId;

        const exists = await SavedPolicy.findOne({ user: userId, policy: policyId });
        res.status(200).json({ success: true, isSaved: !!exists });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    savePolicy,
    getSavedPolicies,
    removeSavedPolicy,
    checkSavedPolicy
};
