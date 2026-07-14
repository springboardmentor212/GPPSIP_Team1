/**
 * Reusable validation middleware that validates Express request parameters (body, query, params) against a Zod schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Parse and get the clean coerced values
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Assign back to express request so controllers get the string version of mobile
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;
    
    next();
  } catch (error) {
    // Map Zod issues array to a readable, formatted output listing all failures
    const formattedErrors = (error.issues || []).map(err => ({
      field: err.path[1] || err.path[0],
      message: err.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: formattedErrors
    });
  }
};

module.exports = validate;
