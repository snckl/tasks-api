process.on('uncaughtException', (err) => {
  console.log(err.message, err.name);
  console.log('Shutting down...');

  process.exit(1);
});

import app from './app.js';
import mongoose, { Schema } from 'mongoose';

const port = process.env.PORT;

mongoose.connect(process.env.DATABASE).then(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Database connection is successful.');
  }
});

const server = app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`App running on port ${port}...`);
  }
});

process.on('unhandledRejection', (err) => {
  console.log(err.message, err.name);
  console.log('Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
