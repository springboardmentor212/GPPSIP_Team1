const { z } = require('zod');

const comparePoliciesSchema = z.object({
  body: z.object({
    ids: z.array(z.string().min(1, 'Policy ID cannot be empty'))
      .min(2, 'At least 2 policy IDs are required for comparison')
      .max(4, 'Maximum 4 policies can be compared at a time')
  })
});

const compareSchemesSchema = z.object({
  body: z.object({
    ids: z.array(z.string().min(1, 'Scheme ID cannot be empty'))
      .min(2, 'At least 2 scheme IDs are required for comparison')
      .max(4, 'Maximum 4 schemes can be compared at a time')
  })
});

module.exports = {
  comparePoliciesSchema,
  compareSchemesSchema
};
