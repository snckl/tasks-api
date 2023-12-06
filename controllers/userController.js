import catchAsync from './../utils/catchAsync.js';
import User from './../models/userModel.js';

// Respond with a 500 Internal Server Error and a message indicating that the route is not defined
export const getAllUsers = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

// Respond with a 500 Internal Server Error and a message indicating that the route is not defined
export const createUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

// Respond with a 500 Internal Server Error and a message indicating that the route is not defined
export const getUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

// Respond with a 500 Internal Server Error and a message indicating that the route is not defined
export const updateUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

// Respond with a 500 Internal Server Error and a message indicating that the route is not defined
export const deleteUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

// Controller function to delete the user's own account
export const deleteMyAccount = catchAsync(async (req, res, next) => {
  // Find the user by ID and update the 'active' field to false
  await User.findOneAndUpdate(req.user.id, { active: false });

  // Respond with success status and no data in the JSON response (204 No Content)
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
