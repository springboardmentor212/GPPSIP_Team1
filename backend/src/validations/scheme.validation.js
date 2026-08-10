const { z } = require('zod');

const schemeCategories = [
  'Scholarships', 'Farmer Welfare', 'Healthcare', 'Housing', 'Business Support',
  'Women Empowerment', 'Senior Citizen Welfare', 'Student Schemes', 'Employment Programs', 'Social Security'
];

const eligibilitySchema = z.object({
  age: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional(),
  gender: z.string().optional(),
  income: z.object({
    max: z.number().optional()
  }).optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  location: z.string().optional(),
  socialCategory: z.string().optional(),
  disabilityStatus: z.boolean().optional()
}).optional();

const createSchemeSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Scheme title is required' }).trim().min(1, 'Title cannot be empty'),
    description: z.string({ required_error: 'Scheme description is required' }).trim().min(1, 'Description cannot be empty'),
    category: z.enum(schemeCategories, { errorMap: () => ({ message: 'Invalid category' }) }),
    eligibilityRules: eligibilitySchema.optional()
  })
});

const updateSchemeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    category: z.enum(schemeCategories).optional(),
    eligibilityRules: eligibilitySchema.optional()
  })
});

module.exports = {
  createSchemeSchema,
  updateSchemeSchema
};
