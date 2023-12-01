import { json } from 'express';
import Task from './../models/taskModel.js';

export const aliasCritics = (req, res, next) => {
  req.query.severity = 'Critical';
  req.query.priority = 'High';
  next();
};

export const getAllTasks = async (req, res, next) => {
  try {
    //Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    //Advanced Filtering
    // There are no numerical values but for implementations.
    const queryStr = JSON.stringify(queryObj);
    queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Task.find(JSON.parse(queryStr));

    //Sorting
    // There are no numerical values but for implementations.
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-uploadDate');
    }

    //Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //Pagination
    query = query
      .skip((req.query.limit - 1) * req.query.page)
      .limit(req.query.limit * 1);

    if (req.query.page) {
      const numTasks = await Task.countDocuments();
      if ((req.query.limit - 1) * req.query.page >= numTasks) {
        throw new Error('This page does not exist.');
      }
    }

    //Execute query.
    const tasks = await query;

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
      message: 'Invalid data.',
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
