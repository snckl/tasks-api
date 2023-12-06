import AppError from '../utils/appError.js';
import Task from './../models/taskModel.js';
import APIFeatures from './../utils/apifeatures.js';
import catchAsync from './../utils/catchAsync.js';
import mongoose from 'mongoose';

// Middleware to alias critics by setting severity to 'Critical' and priority to 'High'
export const aliasCritics = (req, res, next) => {
  req.query.severity = 'Critical';
  req.query.priority = 'High';
  next();
};

// Controller function to get all tasks
export const getAllTasks = catchAsync(async (req, res, next) => {
  //Execute query.
  const features = new APIFeatures(Task.find(), req.query);

  // Apply filtering, sorting, limiting fields, and pagination to the query
  features.filter().sort().limitField().pagination();

  // Execute the query and retrieve the tasks
  const tasks = await features.query;

  // Respond with success status, the number of results, and the task data
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

// Controller function to get a task by its ID
export const getTaskById = catchAsync(async (req, res, next) => {
  // Check if the provided ID is a valid MongoDB ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    next(new AppError('Task could not found with provided id', 404));
    return;
  }

  // Find the task by its ID
  const task = await Task.findById(req.params.id);

  // Respond with success status and the task data
  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

// Controller function to create a new task
export const createTask = catchAsync(async (req, res, next) => {
  // Create a new task in the database using the data from the request body
  const newTask = await Task.create(req.body);

  // Respond with success status, and the newly created task data
  res.status(201).json({
    status: 'success',
    data: {
      task: newTask,
    },
  });
});

// Controller function to update a task by its ID
export const updateTask = catchAsync(async (req, res, next) => {
  // Check if the provided ID is a valid MongoDB ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidObjectId) {
    next(new AppError('Task could not found with provided id', 404));
    return;
  }
  // Update the task by its ID with the data from the request body
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Respond with success status and the updated task data
  res.status(201).json({
    status: 'success',
    data: {
      message: updatedTask,
    },
  });
});

// Controller function to delete a task by its ID
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

// Controller function to get statistics for tasks
export const getTaskStats = catchAsync(async (req, res, next) => {
  // Use the aggregation pipeline to calculate statistics for tasks
  const stats = await Task.aggregate([
    {
      $match: {}, // Match all documents
    },
    {
      $group: {
        _id: { $toUpper: '$severity' }, // Group by the uppercase severity
        numOfTasks: { $sum: 1 }, // Count the number of tasks
        totalCost: { $sum: '$accumulatedCost' }, // Calculate the total accumulated cost
        avgCost: { $avg: '$accumulatedCost' }, // Calculate the average accumulated cost
        maxCost: { $max: '$accumulatedCost' }, // Find the maximum accumulated cost
        minCost: { $min: '$accumulatedCost' }, // Find the minimum accumulated cost
      },
    },
    {
      $sort: { avgCost: -1 }, // Sort the results by average cost in descending order
    },
  ]);
  // Respond with success status and the calculated task statistics
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
