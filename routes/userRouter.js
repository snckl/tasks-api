import Express from 'express';
import * as userController from './../controllers/userController.js';
import * as authController from './../controllers/authController.js';
const router = Express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.delete(
  '/deleteMyAccount',
  authController.protection,
  userController.deleteMyAccount
);

router.patch(
  '/updatePassword',
  authController.protection,
  authController.updatePassword
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
