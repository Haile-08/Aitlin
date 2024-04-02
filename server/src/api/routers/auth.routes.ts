import { authController } from '..';
import { Router } from 'express';

const authRoutHandler = (router: Router) => {
  // Test express app
  router.get('/', authController.testConnection);
};

export default authRoutHandler;