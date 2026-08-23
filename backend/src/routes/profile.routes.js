const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const identifyUser = require('../middlewares/auth.middleware');

const profileRouter = express.Router();

// Require auth for profile routes
profileRouter.use(identifyUser);

/**
 * @route GET /api/profile
 * @desc Get current user profile
 */
profileRouter.get('/', getProfile);

/**
 * @route PUT /api/profile
 * @desc Update current user profile
 */
profileRouter.put('/', updateProfile);

module.exports = profileRouter;
