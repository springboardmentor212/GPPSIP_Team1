const User = require('../models/user.model');

/**
 * @desc Get user profile
 * @route GET /api/profile
 * @access Private
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, profile: user });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Update user profile
 * @route PUT /api/profile
 * @access Private
 */
const updateProfile = async (req, res, next) => {
    try {
        // Prevent password and role updates through this route
        const { password, role, ...updateFields } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Profile updated successfully', profile: user });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile
};
