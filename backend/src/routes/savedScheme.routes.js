const express = require('express');
const {
    saveScheme,
    getSavedSchemes,
    removeSavedScheme,
    checkSavedScheme
} = require('../controllers/savedScheme.controller');
const identifyUser = require('../middlewares/auth.middleware');

const savedSchemeRouter = express.Router();

// All routes require authentication
savedSchemeRouter.use(identifyUser);

/**
 * @route POST /api/saved-schemes
 * @desc Save a scheme
 */
savedSchemeRouter.post('/', saveScheme);

/**
 * @route GET /api/saved-schemes
 * @desc Get all saved schemes for the user
 */
savedSchemeRouter.get('/', getSavedSchemes);

/**
 * @route DELETE /api/saved-schemes/:schemeId
 * @desc Remove a saved scheme
 */
savedSchemeRouter.delete('/:schemeId', removeSavedScheme);

/**
 * @route GET /api/saved-schemes/check/:schemeId
 * @desc Check if a scheme is saved
 */
savedSchemeRouter.get('/check/:schemeId', checkSavedScheme);

module.exports = savedSchemeRouter;
