import Task from './../models/taskModel.js';

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
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
