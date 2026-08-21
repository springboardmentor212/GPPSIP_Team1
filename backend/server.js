require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful Shutdown
const gracefulShutdown = async () => {
  console.log('Initiating graceful shutdown...');
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
