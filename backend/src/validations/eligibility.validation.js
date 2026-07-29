const { z } = require('zod');

const checkEligibilitySchema = z.object({
  body: z.object({
    age: z.number().nonnegative().optional(),
    gender: z.string().trim().optional(),
    income: z.number().nonnegative().optional(),
    occupation: z.string().trim().optional(),
    education: z.string().trim().optional(),
    location: z.string().trim().optional(),
    socialCategory: z.string().trim().optional(),
    disabilityStatus: z.boolean().optional()
  })
});

module.exports = {
  checkEligibilitySchema
};
