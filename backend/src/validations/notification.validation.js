const { z } = require('zod');

const getNotificationsSchema = z.object({
  query: z.object({
    category: z.enum(['Policy Update', 'Application Alert', 'Scheme Update', 'System Alert']).optional(),
    unread: z.string().transform((val) => val === 'true').optional()
  }).optional()
});

const notificationIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Notification ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Notification ID format')
  })
});

module.exports = {
  getNotificationsSchema,
  notificationIdSchema
};
