import Express from 'express';
import * as taskController from './../controllers/taskController.js';
import * as authController from './../controllers/authController.js';

const router = Express.Router();

router
  .route('/critics')
  .get(taskController.aliasCritics, taskController.getAllTasks);

router.route('/stats').get(taskController.getTaskStats);

router
  .route('/')
  .get(authController.protection, taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTaskById)
  .patch(taskController.updateTask)
  .delete(
    authController.protection,
    authController.restrictTo('admin'),
    taskController.deleteTasks
  );

export default router;
