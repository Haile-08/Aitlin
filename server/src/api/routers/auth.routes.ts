import { authController } from '..';
import { Router } from 'express';

const authRoutHandler = (router: Router) => {
  // Test express app
  router.get('/', authController.testConnection);

  // login route
  router.post('/login', authController.loginHandler);

  // request to reset password
  router.post('/passwordResetRequest', authController.passwordResetRequestHandler);

  // reset password
  router.post('/resetPassword', authController.passwordResetHandler);
};

export default authRoutHandler;