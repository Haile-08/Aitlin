import { Express, Request, Response, NextFunction } from 'express';

/**
 * Handle express global error
 * @param app express app
 */
const expressGlobalErrorHandler = (app: Express) =>{
  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message,
    });
  });
};

export default expressGlobalErrorHandler;