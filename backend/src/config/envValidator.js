const Joi = require('joi');

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required().description('MongoDB connection string is required'),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign tokens'),
  GEMINI_API_KEY: Joi.string().optional().allow('').description('Optional API Key for AI Assistant features'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173')
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  console.error(`\x1b[31m[Config Error] Missing or invalid environment variables:\x1b[0m\n${error.message}`);
  process.exit(1);
}

module.exports = envVars;
