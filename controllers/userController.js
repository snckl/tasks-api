import catchAsync from './../utils/catchAsync.js';
import User from './../models/userModel.js';
import isValidId from './../utils/validId.js';

//Checks if id is valid.

// Gets all users.
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-passwordResetToken');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Get user with provided ID
export const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  isValidId(id, next, 'User');

  const user = await User.findById(id).select('-passwordResetToken');

  res.status(200).json({
    status: 'success',
    message: user,
  });
});

// WARNING!!! USER ONLY CAN UPDATE HIS NAME AND EMAIL ON THIS CONTROLLER.
export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  isValidId(id, next, 'User');
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: 'success',
    data: user,
  });
});

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
