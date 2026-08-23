const express = require('express');
const { getRecommendations } = require('../controllers/recommendation.controller');
const identifyUser = require('../middlewares/auth.middleware');

const recommendationRouter = express.Router();

/**
 * @route POST /api/recommendations
 * @desc Get recommended schemes based on user profile or form data
 * @access Private
 */
recommendationRouter.post('/', identifyUser, getRecommendations);

module.exports = recommendationRouter;
