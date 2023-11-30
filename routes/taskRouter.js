import Express from 'express';
import * as taskController from './../controllers/taskController.js';

const router = Express.Router();

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTaskById)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTasks);

export default router;
