// Event handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err.message, err.name);
  console.log('Shutting down...');
  // Terminate the process with a non-zero exit code
  process.exit(1);
});

import app from './app.js';
import mongoose, { Schema } from 'mongoose';

const port = process.env.PORT;

// Connect to the MongoDB database
mongoose.connect(process.env.DATABASE).then(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Database connection is successful.');
  }
});

// Start the Express server
const server = app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`App running on port ${port}...`);
  }
});

// Event handler for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(err.message, err.name);
  console.log('Shutting down...');
  // Close the server gracefully before terminating the process
  server.close(() => {
    process.exit(1);
  });
});
