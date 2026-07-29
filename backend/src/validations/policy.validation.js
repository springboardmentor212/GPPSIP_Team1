const { z } = require('zod');

const policyCategories = [
  'Education', 'Healthcare', 'Agriculture', 'Employment', 'Finance',
  'Women & Child Welfare', 'Housing', 'Environment', 'Digital Governance', 'Infrastructure'
];

const policyStatuses = ['Draft', 'Pending', 'Approved', 'Rejected', 'Archived'];

const createPolicySchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Policy title is required' }).trim().min(1, 'Title cannot be empty'),
    description: z.string({ required_error: 'Policy description is required' }).trim().min(1, 'Description cannot be empty'),
    department: z.string({ required_error: 'Department is required' }).trim().min(1, 'Department cannot be empty'),
    category: z.enum(policyCategories, { errorMap: () => ({ message: 'Invalid category' }) }),
  })
});

const updatePolicySchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    department: z.string().trim().min(1).optional(),
    category: z.enum(policyCategories).optional(),
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(policyStatuses, { errorMap: () => ({ message: 'Invalid status' }) }),
  })
});

module.exports = {
  createPolicySchema,
  updatePolicySchema,
  updateStatusSchema
};
