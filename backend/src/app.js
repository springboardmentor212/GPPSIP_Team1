const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

/* middleware */
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

/* require routes */
const authRouter = require('./routes/auth.routes');
const policyRouter = require('./routes/policy.routes');
const schemeRouter = require('./routes/scheme.routes');
const approvalRouter = require('./routes/approval.routes');
const comparisonRouter = require('./routes/comparison.routes');
const searchRouter = require('./routes/search.routes');
const eligibilityRouter = require('./routes/eligibility.routes');
const applicationRouter = require('./routes/application.routes');
const feedbackRouter = require('./routes/feedback.routes');
const analyticsRouter = require('./routes/analytics.routes');

/* using routes */
app.use('/api/auth', authRouter);
app.use('/api/policies', policyRouter);
app.use('/api/policies', approvalRouter);
app.use('/api/schemes', schemeRouter);
app.use('/api/schemes', eligibilityRouter);
app.use('/api/search', searchRouter);
app.use('/api/compare', comparisonRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/analytics', analyticsRouter);

/* health check route */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PolicyGPT backend is running',
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to PolicyGPT backend!");
});

/* global error handling middleware */
app.use(errorHandler);

module.exports = app;
