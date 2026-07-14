const jwt = require('jsonwebtoken');

/**
 * Middleware to identify the user from JWT stored in cookie
 */
async function identifyUser(req, res, next) {
    const token = req.cookies["jwt_token"];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token not provided, Unauthorised Access"
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'policygpt_fallback_secret_key_987654');
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token, Unauthorised Access"
        });
    }

    req.user = decoded;
    next();
}

module.exports = identifyUser;
