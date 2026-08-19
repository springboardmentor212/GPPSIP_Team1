const { z } = require('zod');

const getAnalyticsSchema = z.object({
  query: z.object({
    period: z.enum(['7d', '30d', '6m', '12m']).default('30d'),
    category: z.string().optional(),
    department: z.string().optional(),
    sortBy: z.enum(['volume', 'approvalRate', 'processingTime']).default('volume')
  })
});

module.exports = {
  getAnalyticsSchema
};
