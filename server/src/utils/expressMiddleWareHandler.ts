import express, { Express } from 'express';
import cors from 'cors';
import { allowedOrigins } from '../config';

/**
 * Express server middleware
 * @param app express app
 */
const expressMiddleWareHandler = (app: Express) =>{
  app.use(express.json());
  app.use(cors(allowedOrigins));
};

export default expressMiddleWareHandler;