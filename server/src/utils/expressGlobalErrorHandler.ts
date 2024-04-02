import { Express, Request, Response, NextFunction } from 'express';

/**
 * Handle express global error
 * @param app express app
 */
const expressGlobalErrorHandler = (app: Express) =>{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode: number = error.statusCode || 500;
    const message: string = error.message;
    return res.status(statusCode).json({
      status: statusCode,
      message,
    });
  });
};

export default expressGlobalErrorHandler;