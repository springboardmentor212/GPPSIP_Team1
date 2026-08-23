const express = require('express');
const { registerController, loginController, logoutController, getMeController, changePasswordController } = require('../controllers/auth.controller');
const identifyUser = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', validate(registerSchema), registerController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', validate(loginSchema), loginController);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.post('/logout', logoutController);

/**
 * @route GET /api/auth/me
 * @desc Get current user details
 * @access Private
 */
authRouter.get('/me', identifyUser, getMeController);

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
authRouter.post('/change-password', identifyUser, changePasswordController);

module.exports = authRouter;