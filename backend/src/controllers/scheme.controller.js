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

        // Automated Notification Trigger for Citizens if a New Scheme is Registered
        const Notification = require('../models/notification.model');
        const User = require('../models/user.model');
        const citizens = await User.find({ role: 'Citizen' }).select('_id');
        if (citizens.length > 0) {
            const notifications = citizens.map(c => ({
                recipient: c._id,
                title: `New Government Scheme: ${scheme.title}`,
                subtitle: `Category: ${scheme.category || 'Welfare'}`,
                description: `A new government scheme has been registered. Visit the Schemes page to check your eligibility for ${scheme.title}.`,
                category: 'Scheme Update',
                priority: 'NORMAL',
                department: scheme.category,
                associatedResourceId: scheme._id,
                associatedResourceType: 'Scheme'
            }));
            // Insert silently in background
            Notification.insertMany(notifications).catch(err => console.error("Failed to insert notifications", err));
        }

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

        // Access Control: Only Creator or Super Admin can update
        if (scheme.creator.toString() !== req.user.id && req.user.role !== 'Super Admin') {
            return res.status(403).json({ success: false, message: 'Forbidden: You can only update schemes you created' });
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
        const scheme = await Scheme.findById(req.params.id);
        
        if (!scheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        // Access Control: Only Creator or Super Admin can archive
        if (scheme.creator.toString() !== req.user.id && req.user.role !== 'Super Admin') {
            return res.status(403).json({ success: false, message: 'Forbidden: You can only archive schemes you created' });
        }

        scheme.status = 'Archived';
        await scheme.save();

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
