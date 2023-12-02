import AppError from '../utils/appError.js';
import Task from './../models/taskModel.js';
import APIFeatures from './../utils/apifeatures.js';
import catchAsync from './../utils/catchAsync.js';
import mongoose from 'mongoose';

export const aliasCritics = (req, res, next) => {
  req.query.severity = 'Critical';
  req.query.priority = 'High';
  next();
};

export const getAllTasks = catchAsync(async (req, res, next) => {
  //Execute query.
  const features = new APIFeatures(Task.find(), req.query);
  features.filter().sort().limitField().pagination();
  const tasks = await features.query;

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

export const getTaskById = catchAsync(async (req, res, next) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    next(new AppError('Task could not found with provided id', 404));
    return;
  }

  const task = await Task.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

export const createTask = catchAsync(async (req, res, next) => {
  const newTask = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      task: newTask,
    },
  });
});

export const updateTask = catchAsync(async (req, res, next) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    next(new AppError('Task could not found with provided id', 404));
    return;
  }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: {
      message: updatedTask,
    },
  });
});

export const deleteTasks = catchAsync(async (req, res, next) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    next(new AppError('Task could not found with provided id', 404));
    return;
  }
  await Task.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getTaskStats = catchAsync(async (req, res, next) => {
  const stats = await Task.aggregate([
    {
      $match: {},
    },
    {
      $group: {
        _id: { $toUpper: '$severity' },
        numOfTasks: { $sum: 1 },
        totalCost: { $sum: '$accumulatedCost' },
        avgCost: { $avg: '$accumulatedCost' },
        maxCost: { $max: '$accumulatedCost' },
        minCost: { $min: '$accumulatedCost' },
      },
    },
    {
      $sort: { avgCost: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
