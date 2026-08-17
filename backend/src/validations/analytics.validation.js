const { z } = require('zod');

const getAnalyticsSchema = z.object({
  query: z.object({
    period: z.enum(['30d', '6m', '12m']).default('30d'),
    category: z.string().optional(),
    department: z.string().optional()
  })
});

module.exports = {
  getAnalyticsSchema
};
