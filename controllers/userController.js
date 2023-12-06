import catchAsync from './../utils/catchAsync.js';
import User from './../models/userModel.js';

export const getAllUsers = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
export const createUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
export const getUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
export const updateUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
export const deleteUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

export const deleteMyAccount = catchAsync(async (req, res, next) => {
  await User.findOneAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
