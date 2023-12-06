import AppError from '../utils/appError.js';

const developmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const duplicateTitleError = (err) => {
  const errors = Object.values(err.keyValue).map((er) => er);
  err.statusCode = 409;
  err.message = `${errors.join('. ')} is already exist.`;
  err.isOperational = true;
  return new AppError(err.message, err.statusCode);
};

const validationError = (err) => {
  const errors = Object.values(err.errors).map((er) => er.message);
  err.statusCode = 400;
  err.message = `${errors.join('. ')}`;
  err.isOperational = true;
  return new AppError(err.message, err.statusCode);
};

const productionError = (err, res) => {
  if (err.isOperational) {
    //Expected Errors.
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  } else {
    //Unexpected Error.
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong.',
    });
  }
};

export default (err, req, res, next) => {
  if (err.code === 11000) {
    duplicateTitleError(err);
  } else if (err.name === 'ValidationError') {
    validationError(err);
  } else {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
  }

  if (process.env.NODE_ENV === 'development') {
    developmentError(err, res);
  } else {
    productionError(err, res);
  }
};
