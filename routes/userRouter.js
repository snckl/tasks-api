import Express from 'express';
import * as userController from './../controllers/userController.js';
import * as authController from './../controllers/authController.js';
const router = Express.Router();

router.post('/signup', authController.signup); // User signup
router.post('/login', authController.login); // User login

// Routes for password reset for forgotten password and account deletion
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.delete(
  '/deleteMyAccount',
  authController.protection,
  userController.deleteMyAccount
);

// Routes for updating password
router.patch(
  '/updatePassword',
  authController.protection,
  authController.updatePassword
);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

export default router;
