const express = require('express');
const { searchAll } = require('../controllers/search.controller');

const searchRouter = express.Router();

/**
 * @route GET /api/search
 * @desc Unified Search for Policies and Schemes
 * @access Public
 */
searchRouter.get('/', searchAll);

module.exports = searchRouter;
