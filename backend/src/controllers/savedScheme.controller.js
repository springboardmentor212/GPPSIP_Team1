const SavedScheme = require('../models/savedScheme.model');

/**
 * @desc Save/bookmark a scheme
 * @route POST /api/saved-schemes
 * @access Private
 */
const saveScheme = async (req, res, next) => {
    try {
        const { schemeId } = req.body;
        const userId = req.user.id;

        if (!schemeId) {
            return res.status(400).json({ success: false, message: 'schemeId is required' });
        }

        // Check if already saved
        const existing = await SavedScheme.findOne({ user: userId, scheme: schemeId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Scheme already saved' });
        }

        const saved = new SavedScheme({ user: userId, scheme: schemeId });
        await saved.save();

        res.status(201).json({ success: true, message: 'Scheme saved successfully', savedScheme: saved });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get all saved schemes for current user
 * @route GET /api/saved-schemes
 * @access Private
 */
const getSavedSchemes = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const savedSchemes = await SavedScheme.find({ user: userId })
            .populate({
                path: 'scheme',
                populate: { path: 'creator', select: 'fullName email' }
            })
            .sort({ createdAt: -1 });

        // Filter out any where the scheme was deleted
        const schemes = savedSchemes
            .filter(ss => ss.scheme !== null)
            .map(ss => ({
                _id: ss._id,
                savedAt: ss.createdAt,
                ...ss.scheme.toObject()
            }));

        res.status(200).json({ success: true, schemes });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Remove a saved/bookmarked scheme
 * @route DELETE /api/saved-schemes/:schemeId
 * @access Private
 */
const removeSavedScheme = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const schemeId = req.params.schemeId;

        const deleted = await SavedScheme.findOneAndDelete({ user: userId, scheme: schemeId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Saved scheme not found' });
        }

        res.status(200).json({ success: true, message: 'Scheme removed from saved list' });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Check if a scheme is saved by current user
 * @route GET /api/saved-schemes/check/:schemeId
 * @access Private
 */
const checkSavedScheme = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const schemeId = req.params.schemeId;

        const exists = await SavedScheme.findOne({ user: userId, scheme: schemeId });
        res.status(200).json({ success: true, isSaved: !!exists });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    saveScheme,
    getSavedSchemes,
    removeSavedScheme,
    checkSavedScheme
};
