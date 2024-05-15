import express from 'express';
import { expressGlobalErrorHandler, expressMiddleWareHandler, serverInitHandler } from './utils';
import { expressConnectDB } from './config';
import { expressRouteHandler } from './api';


const app = express();

// connect to mongodb
expressConnectDB();

// handle express middleware
expressMiddleWareHandler(app);

// handle express routes
expressRouteHandler(app);


// handle express initialization
serverInitHandler(app);

// handle global errors
expressGlobalErrorHandler(app);

export default app;