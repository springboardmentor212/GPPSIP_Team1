const express = require('express');
const { registerController, loginController } = require('../controllers/auth.controller');


const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', registerController);


/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', loginController);


module.exports = authRouter;