const express = require('express');
const { upload, uploadFile } = require('../controllers/upload.controller');
const identifyUser = require('../middlewares/auth.middleware');

const uploadRouter = express.Router();

/**
 * @route POST /api/upload
 * @desc Upload a single document
 * @access Private
 */
uploadRouter.post('/', identifyUser, upload.single('document'), uploadFile);

module.exports = uploadRouter;
