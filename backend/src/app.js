const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();

/* middleware */
app.use(express.json());
app.use(cookieParser());


/* require routes */
const authRouter = require('./routes/auth.routes')


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

module.exports = app;
