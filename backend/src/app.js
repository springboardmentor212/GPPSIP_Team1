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

/* using routes */
app.use('/api/auth', authRouter);

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
