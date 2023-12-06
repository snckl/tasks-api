// Define a custom error class that extends the built-in Error class
class AppError extends Error {
  constructor(message, statusCode) {
    // Call the constructor of the parent class (Error)
    super(message);
    this.statusCode = statusCode;
    // Set the status property based on the statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';

    // Set the isOperational property to true to indicate it's an operational error
    this.isOperational = true;

    // Capture the stack trace to help with debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
