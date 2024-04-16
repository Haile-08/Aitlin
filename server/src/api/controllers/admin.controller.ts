import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Service, User } from '../../database';
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
      const { Name, status, ServiceData, email, Notification } = req.body;

      if (!email || !Name || !status || !ServiceData) {
        return res.json({ 
          message: 'All fields are required',
          success: false
        });
      }

      const existingUser = await User.findOne({ email });

      if (status == 'new'){
        if (existingUser) {
          return res.json({ 
            message: 'Client already exists',
            success: false, 
          });
        }
        const salt = await bcrypt.genSalt();
        const password = Math.random().toString(36).slice(2, 10);
        const passwordHash = await bcrypt.hash(password, salt);

        const client = await User.create({
          Name,
          email,
          password: passwordHash,
          type: 'client',
          Notification,
        });

        const service = await Service.create({
          clientId: client._id,
          clientName: client.Name,
          serviceName: ServiceData,
          email: client.email,
          status: true,
          Notification: Notification || false,
        });

        sendEmail(
          client.email,
          'Welcome to Aitlin',
          {
            name: client.Name,
            email: client.email,
            password,
            link: undefined
          },
          './template/newClient.handlebars'
        );
        return res.status(201).json({
          message: 'Account created successfully',
          success: true,
          data: {
            client,
            service
          },
        });
      } else {
        if (!existingUser){
          return res.json({ 
            message: 'Client does not exists',
            success:  false,
          });
        }
        const service = await Service.create({
          clientId: existingUser._id,
          clientName: existingUser.Name,
          serviceName: ServiceData,
          email: existingUser.email,
          status: true,
          Notification: Notification || false,
        });
        return res.status(201).json({
          message: 'Service created successfully',
          success: true,
          data: service,
        });
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
  static async handleGetAllClient(req: Request, res: Response) {
    try {
      const pageNum: number = Number(req.query.page) || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';

      console.log('search', searchTerm);
  
      const servicePerPage: number = 9;
      const services = await Service.find({ serviceName: { $regex: searchTerm, $options: 'i' } });
  
      const startIndex = pageNum * servicePerPage;
      const endIndex = startIndex + servicePerPage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceList: any[] = services.slice(startIndex, endIndex).map((service) => service.toObject());

      console.log(services);

      res.status(200).json({
        message: 'Services fetched successfully',
        success: true,
        services: serviceList,
        hasMore: endIndex < services.length,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
     * update the service status
     * @param req request object
     * @param res response object
     */
  static async handleServiceStatus(req: Request, res: Response) {
    try {
      const {id, status} = req.body;
      console.log('id', id);
      console.log('status', status);

      const updatedService = await Service.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      res.status(200).json({ message: 'Service status updated successfully', success: true, updatedService });

    } catch (error) {
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }
}

export default adminController;