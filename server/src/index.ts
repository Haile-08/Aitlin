import express from 'express';
import { expressGlobalErrorHandler, expressMiddleWareHandler, serverInitHandler } from './utils';
import { expressConnectDB } from './config';


const app = express();

// connect to mongodb
expressConnectDB();

// handle express middleware
expressMiddleWareHandler(app);

// handle express routes
expressRouteHandler(app);

// handle global errors
expressGlobalErrorHandler(app);

// handle express initialization
serverInitHandler(app);

export default app;