import app from './app.js';
import mongoose, { Schema } from 'mongoose';

const port = process.env.PORT;

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('Database connection is successful.'));

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
