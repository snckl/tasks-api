import Express from 'express';
import * as taskController from './../controllers/taskController.js';
import * as authController from './../controllers/authController.js';

const router = Express.Router();

// Route for getting tasks with severity 'Critical' and priority 'High'
router
  .route('/critics')
  .get(taskController.aliasCritics, taskController.getAllTasks);

// Route for getting task statistics
router.route('/stats').get(taskController.getTaskStats);

// Routes for handling getAll and createTask
router
  .route('/')
  .get(authController.protection, taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTaskById) // Get a specific task by ID
  .patch(taskController.updateTask) // Update a task by ID
  .delete(
    authController.protection, // Authentication protection
    authController.restrictTo('admin'), // Restrict access to admins
    taskController.deleteTasks // Delete tasks by ID
  );

export default router;
