import express, { Express } from 'express';
import { adminRoutHandler, authRoutHandler, clientRoutHandler } from '..';

/**
 * route handler to the express application
 * @param app express app
 */

const expressRouteHandler = (app: Express) => {
  const router = express.Router();
  
  // Api versioning
  app.use('/api/v1', router);
  
  // auth router
  authRoutHandler(router);

  // admin router
  adminRoutHandler(router);

  // client router
  clientRoutHandler(router);
};

export default expressRouteHandler;