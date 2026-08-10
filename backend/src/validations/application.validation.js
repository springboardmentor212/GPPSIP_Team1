const { z } = require('zod');

const createApplicationSchema = z.object({
  body: z.object({
    schemeId: z.string({ required_error: 'Scheme ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format')
  })
});

const rejectApplicationSchema = z.object({
  body: z.object({
    comments: z.string({ required_error: 'Rejection comments are required' })
      .trim()
      .min(1, 'Rejection comments cannot be empty')
  })
});

module.exports = {
  createApplicationSchema,
  rejectApplicationSchema
};
