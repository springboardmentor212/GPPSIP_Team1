const { z } = require('zod');

const approvalActionSchema = z.object({
  body: z.object({
    comments: z.string().trim().optional()
  })
});

const rejectPolicySchema = z.object({
  body: z.object({
    comments: z.string({ required_error: 'Rejection comments are required' })
      .trim()
      .min(1, 'Rejection comments cannot be empty')
  })
});

module.exports = {
  approvalActionSchema,
  rejectPolicySchema
};
