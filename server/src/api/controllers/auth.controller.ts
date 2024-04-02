import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../database';
import { JWT_SECRET } from '../../config';

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
  
  /**
   * login user
   * @param req request object
   * @param res response object
   */
  static async loginHandler(req: Request, res: Response){
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ 
          message: 'Email not found',
          success: false
        });
      }

      if (!user.password){
        return res.json({ 
          message: 'User do not have a password',
          success: false
        });
      }
  
      const isCorrect = bcrypt.compare(password, user.password);
      if (!isCorrect) {
        return res.json({ 
          message: 'incorrect password',
          success: false,
        });
      }

      if (!JWT_SECRET) {
        return res.status(500).json({
          message: 'JWT_SECRET is not defined',
          success: false
        });
      }
  
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
  
      return res.status(201).json({
        message: 'User logged in successfully',
        success: true,
        data: {
          user,
          token,
        }
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return res.status(500).json({ message: err.message, success: false  });
    }
  }
}

export default authController;