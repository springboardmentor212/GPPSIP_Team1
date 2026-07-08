require('dotenv').config();

const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PolicyGPT backend is running',
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to PolicyGPT backend!");
});

module.exports = app;
