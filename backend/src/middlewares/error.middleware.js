/**
 * Centralized global error handling middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected server error occurred';

  // Centralized handling of MongoDB duplicate key errors (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A user with this ${duplicateField} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    // Hide details/stack trace in production for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;