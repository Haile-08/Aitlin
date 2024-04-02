import express, { Express } from 'express';
import { authRoutHandler } from '..';

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
};

export default expressRouteHandler;