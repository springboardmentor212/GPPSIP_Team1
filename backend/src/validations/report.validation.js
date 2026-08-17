const { z } = require('zod');

const exportReportSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3, 'Report name must be at least 3 characters long').optional(),
    dateRange: z.enum(['30d', '90d', 'year', 'custom']).default('30d'),
    department: z.string().default('all'),
    category: z.string().default('all'),
    format: z.enum(['PDF', 'XLS', 'CSV']).default('PDF'),
    template: z.enum(['Department Performance', 'Policy Compliance', 'Citizen Engagement', 'System Activity']).default('Department Performance')
  })
});

const scheduleReportSchema = z.object({
  body: z.object({
    reportTitle: z.string({ required_error: 'Report title is required' })
      .trim()
      .min(3, 'Report title must be at least 3 characters long')
      .max(100, 'Report title cannot exceed 100 characters'),
    frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly'], {
      errorMap: () => ({ message: 'Frequency must be Daily, Weekly, Monthly, or Yearly' })
    }),
    time: z.string({ required_error: 'Execution time is required' })
      .trim()
      .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i, 'Execution time must be in HH:MM AM/PM format (e.g., 09:00 AM)'),
    department: z.string({ required_error: 'Department scope is required' })
      .trim()
      .min(1, 'Department scope cannot be empty')
  })
});

module.exports = {
  exportReportSchema,
  scheduleReportSchema
};
