import app from './app.js';
import mongoose, { Schema } from 'mongoose';

const port = process.env.PORT;

mongoose.connect(process.env.DATABASE).then(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Database connection is successful.');
  }
});

app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`App running on port ${port}...`);
  }
});
