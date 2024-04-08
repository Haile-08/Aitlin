import express, { Express } from 'express';
import { adminRoutHandler, authRoutHandler } from '..';

/**
 * route handler to the express application
 * @param app express app
 */

const expressRouteHandler = (app: Express) => {
  const router = express.Router();
  
  // Api versioning
  app.use('/v1', router);
  
  // auth router
  authRoutHandler(router);

  // admin router
  adminRoutHandler(router);
};

export default expressRouteHandler;