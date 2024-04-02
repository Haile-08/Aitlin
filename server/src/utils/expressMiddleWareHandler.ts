import express, { Express } from 'express';
import cors from 'cors';

/**
 * Express server middleware
 * @param app express app
 */
const expressMiddleWareHandler = (app: Express) =>{
  app.use(express.json());
  app.use(cors());
};

export default expressMiddleWareHandler;