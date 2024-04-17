import { Request, Response } from 'express';
import { Service } from '../../database';

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
  
      const servicePerPage: number = 9;
      const services = await Service.find({ serviceName: { $regex: searchTerm, $options: 'i' },clientId: clientId });

      console.log('data', services);
  
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

}

export default clientController;