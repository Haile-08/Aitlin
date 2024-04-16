import { adminController} from '..';
import { Router } from 'express';
import authMiddleWare from '../../utils/authMiddleWare';

const adminRoutHandler = (router: Router) => {
  // add new client route
  router.post('/admin/add',authMiddleWare, adminController.handleAddClient);

  // get all the clients route
  router.get('/admin/service', authMiddleWare, adminController.handleGetAllClient);

  // update the status of the service
  router.put('/admin/service/status', authMiddleWare, adminController.handleServiceStatus);

};

export default adminRoutHandler;