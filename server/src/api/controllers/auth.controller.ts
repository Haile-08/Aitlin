import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Token, User } from '../../database';
import { JWT_SECRET } from '../../config';
import { sendEmail } from '../../utils';

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

  /**
   * request for password reset
   * @param req request object
   * @param res response object
   */
  static async passwordResetRequestHandler(req: Request, res: Response){
    const { email } = req.body;
    const user = await User.findOne({ email });

    // check if there is a user
    if (!user){
      return res.json({ 
        message: 'User does not exist',
        success: false,
      });
    }

    const token = await Token.findOne({ userId: user._id });

    // if token exists delete
    if (token){ 
      await token.deleteOne();
    }

    const salt = await bcrypt.genSalt();

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: 'JWT_SECRET is not defined',
        success: false
      });
    }

    const hash = await bcrypt.hash(salt, JWT_SECRET);

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `https://aitlin.vercel.app/reset/${salt}/${user._id}`;
    

    sendEmail(
      user.email,
      'Password Reset Request',
      { name: user.firstName, link: link },
      './template/requestPassowrdReset.handlebars'
    );

    res.status(201).json({ message: 'reset email sent', success: true, link });
  }

  /**
   * reset password
   * @param req request object
   * @param res response object
   */
  static async passwordResetHandler(req: Request, res: Response){
    const { userId, token, password } = req.body;

    const userReset = await Token.findOne({ userId });

    if (!userReset) {
      return res.json({ 
        message: 'Invalid or expired password reset token',
        success: false
      });
    }
    const isValid = await bcrypt.compare(token, userReset.token);

    if (!isValid) {
      return res.json({ 
        message: 'Invalid or expired password reset token',
        success: false
      });
    }

    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(password, salt);


    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    const user = await User.findById({ _id: userId });

    // check if there is a user
    if (!user){
      return res.json({ 
        message: 'User does not exist',
        success: false,
      });
    }

    sendEmail(
      user.email,
      'Password Reset Successfully',
      {
        name: user.firstName,
        link: undefined
      },
      './template/resetPassword.handlebars'
    );
    await userReset.deleteOne();
    
    res.status(201).json({ 
      message: 'reset email sent', 
      success: true });
  }
}

export default authController;