const express = require('express');
const { 
    createScheme, 
    getSchemes, 
    getSchemeById, 
    updateScheme, 
    archiveScheme 
} = require('../controllers/scheme.controller');
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { 
    createSchemeSchema, 
    updateSchemeSchema 
} = require('../validations/scheme.validation');

const schemeRouter = express.Router();

/**
 * @route POST /api/schemes
 * @desc Register a new scheme
 * @access Private (Gov. Official)
 */
schemeRouter.post('/', identifyUser, authorize(['Gov. Official']), validate(createSchemeSchema), createScheme);

/**
 * @route GET /api/schemes
 * @desc Get all schemes
 * @access Public
 */
schemeRouter.get('/', getSchemes);

/**
 * @route GET /api/schemes/:id
 * @desc Get scheme by ID
 * @access Public
 */
schemeRouter.get('/:id', getSchemeById);

/**
 * @route PUT /api/schemes/:id
 * @desc Update a scheme
 * @access Private (Gov. Official)
 */
schemeRouter.put('/:id', identifyUser, authorize(['Gov. Official']), validate(updateSchemeSchema), updateScheme);

/**
 * @route PATCH /api/schemes/:id/archive
 * @desc Archive a scheme
 * @access Private (Gov. Official)
 */
schemeRouter.patch('/:id/archive', identifyUser, authorize(['Gov. Official']), archiveScheme);

module.exports = schemeRouter;
