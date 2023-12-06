import Express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import taskRouter from './routes/taskRouter.js';
import AppError from './utils/appError.js';
import globalErrorController from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

dotenv.config({ path: './config.env' });

const app = Express();

// Setting HTTP response headers
app.use(helmet()); //  Calling function for its return.

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Limiting requests from one ip in one hour window.
const limiter = rateLimit({
  max: 250,
  windowMs: 3600000, // One hour
  message: 'Too many tries,Please try again in an hour.',
});

app.use('/api', limiter); // Only limits for api route
app.use(Express.json({ limit: '90kb' })); // Limit req.body by 90 kilobytes

// Cleaning data to prevent {NO SQL! } injection
app.use(mongoSanitize()); // Filter out all of the dollar signs and dots.

// Clean data to prevent XSS
app.use(xss());
// Mongoose already prevent xss with proper validators but this is good also practice

// In order to prevent parameter pollution
app.use(
  hpp({
    whitelist: ['severity', 'priority'],
  })
);

// For static files.
app.use(Express.static('./public'));

// Using taskRouter for url start with /api/v1/tasks
app.use('/api/v1/tasks', taskRouter);
// Using userRouter for url start with /api/v1/users
app.use('/api/v1/users', userRouter);

// 404 Not found message.
app.all('*', (req, res, next) => {
  next(new AppError(`Could not found the ${req.originalUrl}`, 404));
});

//Error handling middleware.
app.use(globalErrorController);

export default app;
