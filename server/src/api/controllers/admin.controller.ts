import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../database';
import { sendEmail } from '../../utils';

/* Represent a run time controller*/
class adminController {
  /**
     * add a new client
     * @param req request object
     * @param res response object
     */
  static async handleAddClient(req: Request, res: Response){
    try {
      const { Name, status, Service, email, Notification } = req.body;

      if (!email || !Name || !status || !Service || !Notification) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && status == 'new') {
        return res.json({ message: 'Client already exists' });
      }

      const salt = await bcrypt.genSalt();
      const password = Math.random().toString(36).slice(2, 10);
      const passwordHash = await bcrypt.hash(password, salt);

      const client = await User.create({
        Name,
        email,
        password: passwordHash,
        type: 'client',
        status: true,
      });

      if ( status == 'new'){
        sendEmail(
          client.email,
          'New Client',
          {
            name: client.Name,
            email: client.email,
            password,
            link: undefined
          },
          './template/newClient.handlebars'
        );
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return res.status(500).json({ message: err.message, success: false  });
    
    }
  }

  /**
     * get all clients
     * @param req request object
     * @param res response object
     */
  static async handleGetAllClient(req: Request, res: Response){
    try {
      const pageNum = req.query.page || 0;
      const clientPerPage = 9;
      const client = await User.find({type : 'client'})
        .skip(pageNum * clientPerPage)
        .limit(clientPerPage);
  
      const clientList = [];

      client.forEach((b) => clientList.push(b));
      
      res.status(201).json({
        message: 'client fetched successfully',
        success: true,
        client: clientList,
        hasMore: clientList.length == clientPerPage,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return res.status(500).json({ message: err.message, success: false  });
    
    }
  }
}

export default adminController;