const { z } = require('zod');

const createFeedbackSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' })
      .trim()
      .min(5, 'Title must be at least 5 characters long')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z.string({ required_error: 'Description is required' })
      .trim()
      .min(10, 'Description must be at least 10 characters long')
      .max(1000, 'Description cannot exceed 1000 characters'),
    categoryTag: z.enum(['IT & COMM', 'EDUCATION', 'AGRI', 'HEALTH'], {
      errorMap: () => ({ message: 'Category must be IT & COMM, EDUCATION, AGRI, or HEALTH' })
    }),
    priority: z.enum(['NORMAL', 'HIGH', 'CRITICAL'], {
      errorMap: () => ({ message: 'Priority must be NORMAL, HIGH, or CRITICAL' })
    }).default('NORMAL')
  })
});

const addResponseSchema = z.object({
  body: z.object({
    message: z.string({ required_error: 'Response message is required' })
      .trim()
      .min(2, 'Response message must be at least 2 characters long')
      .max(1000, 'Response message cannot exceed 1000 characters')
  })
});

const updateFeedbackStatusSchema = z.object({
  body: z.object({
    status: z.enum(['OPEN', 'IN PROGRESS', 'RESOLVED'], {
      errorMap: () => ({ message: 'Status must be OPEN, IN PROGRESS, or RESOLVED' })
    })
  })
});

module.exports = {
  createFeedbackSchema,
  addResponseSchema,
  updateFeedbackStatusSchema
};
