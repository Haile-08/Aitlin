import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const authMiddleWare = (req: Request, res: Response, next: NextFunction) => { 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }
  if(!JWT_SECRET) {
    return res.sendStatus(403); // Forbidden
  }
  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  });
};

export default authMiddleWare;