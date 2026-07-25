/**
 * Middleware to authorize users based on their role
 * @param {string[]} allowedRoles - Array of roles permitted to access the route
 */
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You do not have the required role to perform this action"
            });
        }
        next();
    };
};

module.exports = authorize;
