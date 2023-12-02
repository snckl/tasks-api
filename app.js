import Express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import taskRouter from './routes/taskRouter.js';
import AppError from './utils/appError.js';
import globalErrorController from './controllers/errorController.js';

dotenv.config({ path: './config.env' });

const app = Express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(Express.json());
app.use(Express.static('./public')); // For static files.

app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Could not found the ${req.originalUrl}`, 404));
});

//Error handling middleware.
app.use(globalErrorController);

export default app;
