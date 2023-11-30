import Express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import taskRouter from './routes/taskRouter.js';
dotenv.config({ path: './config.env' });

const app = Express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(Express.json());
app.use(Express.static('./public')); // For static files.

app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

export default app;
