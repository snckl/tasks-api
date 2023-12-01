import Task from './../models/taskModel.js';
import APIFeatures from './../utils/apifeatures.js';

export const aliasCritics = (req, res, next) => {
  req.query.severity = 'Critical';
  req.query.priority = 'High';
  next();
};

export const getAllTasks = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: 'Server error.',
    });
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: 'Server error.',
    });
  }
};

export const createTask = async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error.message,
    });
  }
};

export const updateTask = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid data.',
    });
  }
};

export const deleteTasks = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: 'Something went wrong.',
    });
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: 'Something went wrong.',
    });
  }
};
