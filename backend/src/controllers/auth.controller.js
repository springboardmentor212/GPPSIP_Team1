const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
const registerController = async (req, res, next) => {
    try {
        const { fullName, email, mobile, dob, password, state, district, role, adminKey } = req.body;

        if (role === 'Super Admin') {
            const expectedKey = process.env.SUPER_ADMIN_KEY || 'policygpt_super_admin_secret_key_123';
            if (!adminKey || adminKey !== expectedKey) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: Invalid Admin Security Key'
                });
            }
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedMobile = mobile.trim();

        // Check if user already exists by email or mobile (optimized to 1 database query)
        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { mobile: normalizedMobile }]
        });

        if (existingUser) {
            // Check if BOTH email and mobile match
            if (existingUser.email === normalizedEmail && existingUser.mobile === normalizedMobile) {
                return res.status(400).json({
                    success: false,
                    message: 'A user with this email address and mobile number already exists'
                });
            }
            
            // Check if email matches
            if (existingUser.email === normalizedEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'A user with this email address already exists'
                });
            }

            // Check if mobile matches
            if (existingUser.mobile === normalizedMobile) {
                return res.status(400).json({
                    success: false,
                    message: 'A user with this mobile number already exists'
                });
            }
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user document
        const user = new User({
            fullName,
            email: normalizedEmail,
            mobile: normalizedMobile,
            dob,
            password: hashedPassword,
            state,
            district,
            role: role || 'Citizen',
            termsAccepted: true
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'policygpt_fallback_secret_key_987654',
            { expiresIn: '7d' }
        );

        // Save token in cookie under "jwt_token"
        res.cookie('jwt_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        // Exclude password from the returned user object   
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        // Find user by email
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'policygpt_fallback_secret_key_987654',
            { expiresIn: '7d' }
        );

        // Save token in cookie under "jwt_token"
        res.cookie('jwt_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        // Exclude password from output
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: userResponse
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route POST /api/auth/logout
 * @desc Logout a user and clear cookie
 * @access Public
 */
const logoutController = async (req, res, next) => {
    try {
        res.clearCookie('jwt_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/auth/me
 * @desc Get current user details
 * @access Private
 */
const getMeController = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerController,
    loginController,
    logoutController,
    getMeController
};