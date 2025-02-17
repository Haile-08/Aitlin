import { Request, Response } from 'express';
import { Notification, Service } from '../../database';

/* Represent a client controller*/
class clientController {
  /**
    * test the express api
    * @param req request object
    * @param res response object
    */
  static async handleGetAllService(req: Request, res: Response) {
    try {
      const pageNum: number = Number(req.query.page) || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm: any = req.query.search || '.*';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clientId: any = req.query.clientId || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bar: any = req.query.bar || 'client';
  
      const servicePerPage: number = 9;
      const query: any = {
        $or: [
          { email: { $regex: searchTerm, $options: 'i' } },
          { serviceName: { $regex: searchTerm, $options: 'i' } },
          { clientName: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      // Include clientId in the query if it's provided
      if (clientId) {
        query.clientId = clientId;
      }

      // Determine sorting field
      const sortField = bar === 'client' ? 'clientName' : bar === 'service' ? 'serviceName' : 'email';

      const services = await Service.find(query).sort({ [sortField]: 1 }).skip(pageNum * servicePerPage).limit(servicePerPage);
  
      const startIndex = pageNum * servicePerPage;
      const endIndex = startIndex + servicePerPage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceList: any[] = services.slice(startIndex, endIndex).map((service) => service.toObject());

      res.status(200).json({
        message: 'Services fetched successfully',
        success: true,
        data: serviceList,
        hasMore: endIndex < services.length,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
    * get all notification
    * @param req request object
    * @param res response object
    */
  static async handleGetAllNotification(req: Request, res: Response) {
    try{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clientId: any = req.query.clientId || '';

      const notifications = await Notification.find({ clientId: clientId, read: false });

      res.status(200).json({
        message: 'notifications fetched successfully',
        success: true,
        data: notifications,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
    * get all notification
    * @param req request object
    * @param res response object
    */
  static async handleUpdateNotification(req: Request, res: Response) {
    try{
      const {id} = req.body;

      const updatedNotification = await Notification.findOneAndUpdate(
        { _id: id },
        { $set: { read: true } },
        { new: true }
      );

      res.status(200).json({
        message: 'notifications updated successfully',
        success: true,
        data: updatedNotification,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }

  /**
    * get all notification
    * @param req request object
    * @param res response object
    */
  static async handleUpdateDocumentNotification(req: Request, res: Response) {
    try{
      const {id, status} = req.body;

      const updatedService = await Service.findOneAndUpdate(
        { _id: id },
        { $set: { Notification: status } },
        { new: true }
      );

      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found', success: false });
      }

      res.status(200).json({
        message: 'notifications updated successfully',
        success: true,
        data: updatedService,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  }
}

export default clientController;