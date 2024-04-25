import { clientController } from '..';
import { Router } from 'express';
import authMiddleWare from '../../utils/authMiddleWare';

const clientRoutHandler = (router: Router) => {
  // get all client service
  router.get('/client/service', authMiddleWare, clientController.handleGetAllService);
  router.get('/client/notification', authMiddleWare, clientController.handleGetAllNotification);
  router.put('/client/notification', authMiddleWare, clientController.handleUpdateNotification);
};

export default clientRoutHandler;