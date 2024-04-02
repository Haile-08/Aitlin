import { Request, Response } from 'express';

/* Represent a run time controller*/
class authController {
  /**
   * test the express api
   * @param req request object
   * @param res response object
   */
  static testConnection(req: Request, res: Response){
    res.status(200).json({data: 'server working'});
  }
}

export default authController;