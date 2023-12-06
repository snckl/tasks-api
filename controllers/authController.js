import User from '../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from './../utils/appError.js';
import { promisify } from 'util';
import sendEmail from './../utils/email.js';
import crypto from 'crypto';

// Function to create a JWT token based on a given user ID
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Function to create a JWT token, send it as a cookie, and respond with user data
const createAndSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const optionsOfCookie = {
    expires: new Date(
      Date.now() + process.env.COOKIE_JWT_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Cannot be accessed or be modified by the browser. XSS
  };

  if (process.env.NODE_ENV === 'production') optionsOfCookie.secure = true; // Only will be sent in https if we are on production
  res.cookie('jwt', token, optionsOfCookie);

  user.password = undefined; // Remove password from output.

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

// Controller function for user signup
export const signup = catchAsync(async (req, res, next) => {
  // Create a new user in the database using data from the request body
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  createAndSendToken(newUser, 201, res);
});

// Controller function for user login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide both email and password.', 400));
  }

  // Find the user by email and include the password in the selection
  const user = await User.findOne({ email }).select('+password');

  // Check if the user exists and if the provided password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // Create and send a JWT token in the response for successful login
  createAndSendToken(user, 200, res);
});

// Middleware to protect routes by checking the validity of a JWT token
export const protection = catchAsync(async (req, res, next) => {
  let token;

  // Check if the request headers contain an authorization token starting with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not authorized.Please log in.', 401));
  }
  // Decode the token using the JWT_SECRET from environment variables
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const checkUser = await User.findById(decoded.id);

  // If the user does not exist, return an error indicating unauthorized access
  if (!checkUser) {
    return next(new AppError('The user does not exist anymore.', 401));
  }
  // Check if the user changed the password after the token was issued
  if (checkUser.changedPassword(decoded.iat)) {
    return next(new AppError('User recently changed password.', 401));
  }

  // Attach the user object to the request for further processing in subsequent middleware or routes
  req.user = checkUser;
  next();
});

// Middleware to restrict access to specific roles
export const restrictTo = (...roles) => {
  // Return a middleware function that checks if the user's role is included in the allowed roles
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      // If not, return an error indicating forbidden access
      return next(new AppError('You are not authorized.', 403));
    }

    // If the user's role is allowed, move to the next middleware or route
    next();
  };
};

// Controller function for handling forgot password requests
export const forgotPassword = catchAsync(async (req, res, next) => {
  // Find user by email in the database
  const user = await User.findOne({ email: req.body.email });

  // If no user is found, return an error indicating that there is no user with the provided email
  if (!user) {
    return next(new AppError('There is no user with email.', 404));
  }

  // Generate a password reset token and get the reset URL
  const resetToken = user.createPasswordResetToken();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  // Create a message with the reset URL
  const message = `Forgot your password? Patch request with password and passwordConfirm to ${resetUrl}`;

  try {
    // Send an email with the reset URL to the user's email address
    await sendEmail({
      email: user.email,
      subject: 'Password reset',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token has been sent',
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error.', 500));
  }
});

// Controller function for handling password reset for forgotPassword
export const resetPassword = catchAsync(async (req, res, next) => {
  // Hash the token parameter to match with the stored hashed token in the database
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find a user with the matching hashed token and a valid expiration date
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });

  // If no user is found, or the token is invalid or expired, return an error
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Update the user's password and remove the password reset token and expiration data
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;

  // Save the updated user to the database
  await user.save();

  // Create and send a new JWT token in the response for successful password reset
  createAndSendToken(user, 200, res);
});

// Controller function for updating the user's password
export const updatePassword = catchAsync(async (req, res, next) => {
  // Find the user by ID and include the password in the selection
  const user = await User.findById(req.user.id).select('+password');

  // Check if the current password provided in the request matches the stored password
  if (!(await user.confirmPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update the user's password and save the changes to the database
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // Create and send a new JWT token in the response for successful password update
  createAndSendToken(user, 200, res);
});
