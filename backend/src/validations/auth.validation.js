const { z } = require('zod');

// Schema representing the expected request body for registration
const registerSchema = z.object({
  body: z.object({
    fullName: z.string({ required_error: 'Full name is required' })
      .trim()
      .min(1, 'Full name cannot be empty'),
      
    email: z.string({ required_error: 'Email address is required' })
      .trim()
      .email('Please provide a valid email address'),
      
    mobile: z.string({ required_error: 'Mobile number is required' })
      .trim()
      .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
      
    dob: z.string({ required_error: 'Date of birth is required' })
      .refine((val) => !isNaN(Date.parse(val)), 'Please provide a valid date of birth'),
      
    password: z.string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
      
    state: z.string({ required_error: 'State is required' })
      .trim()
      .min(1, 'State cannot be empty'),
      
    district: z.string({ required_error: 'District is required' })
      .trim()
      .min(1, 'District cannot be empty'),
      
    role: z.enum(['Citizen', 'Gov. Official', 'Researcher/NGO'], {
      errorMap: () => ({ message: 'Role must be Citizen, Gov. Official, or Researcher/NGO' })
    }).default('Citizen'),
    
    termsAccepted: z.boolean({ required_error: 'You must accept the terms of service' })
      .refine((val) => val === true, 'You must accept the terms of service')
  })
});

// Schema representing the expected request body for login
const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email address is required' })
      .trim()
      .email('Please provide a valid email address'),
      
    password: z.string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty')
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
