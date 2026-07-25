const Scheme = require('../models/scheme.model');

/**
 * @desc Create a new scheme
 * @access Private (Gov. Official)
 */
const createScheme = async (req, res, next) => {
    try {
        const { title, description, category, eligibilityRules } = req.body;
        
        const scheme = new Scheme({
            title,
            description,
            category,
            eligibilityRules,
            creator: req.user.id
        });

        await scheme.save();

        res.status(201).json({
            success: true,
            message: 'Scheme registered successfully',
            scheme
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get all schemes
 * @access Public
 */
const getSchemes = async (req, res, next) => {
    try {
        const schemes = await Scheme.find().populate('creator', 'fullName email');
        res.status(200).json({ success: true, schemes });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get scheme by ID
 * @access Public
 */
const getSchemeById = async (req, res, next) => {
    try {
        const scheme = await Scheme.findById(req.params.id).populate('creator', 'fullName email');
        if (!scheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }
        res.status(200).json({ success: true, scheme });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Update a scheme
 * @access Private (Gov. Official)
 */
const updateScheme = async (req, res, next) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        // Explicitly update only allowed fields if they exist in req.body
        const { title, description, category, eligibilityRules } = req.body;
        
        if (title !== undefined) scheme.title = title;
        if (description !== undefined) scheme.description = description;
        if (category !== undefined) scheme.category = category;
        if (eligibilityRules !== undefined) scheme.eligibilityRules = eligibilityRules;

        await scheme.save();

        res.status(200).json({ success: true, message: 'Scheme updated successfully', scheme });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Archive a scheme
 * @access Private (Gov. Official)
 */
const archiveScheme = async (req, res, next) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(
            req.params.id,
            { status: 'Archived' },
            { new: true, runValidators: true }
        );

        if (!scheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        res.status(200).json({ success: true, message: 'Scheme archived successfully', scheme });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createScheme,
    getSchemes,
    getSchemeById,
    updateScheme,
    archiveScheme
};
