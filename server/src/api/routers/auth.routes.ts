import { authController } from '..';
import { Router } from 'express';

const authRoutHandler = (router: Router) => {
  // Test express app
  router.get('/', authController.testConnection);

  // login route
  router.post('login', authController.loginHandler);
};

export default authRoutHandler;