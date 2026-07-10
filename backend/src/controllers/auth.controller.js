
/**
 * @routes POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
const registerController = async (req, res) => {
    res.status(200).json({
        message: 'Register controller works'
    })
}


/**
 * @routes POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
const loginController = async (req, res) => {
    res.status(200).json({
        message: 'Login controller works'
    })
}


module.exports = {
    registerController,
    loginController
}