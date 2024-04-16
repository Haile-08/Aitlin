import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { allowedOrigins } from '../config';

/**
 * Express server middleware
 * @param app express app
 */
const expressMiddleWareHandler = (app: Express) =>{
  app.use(express.json());
  app.use(cors(allowedOrigins));
  app.use(morgan('common'));
  app.use(express.static('public'));
  app.use('/public', express.static(path.join(__dirname, 'public')));
};

export default expressMiddleWareHandler;