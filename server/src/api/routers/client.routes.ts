import { clientController } from '..';
import { Router } from 'express';
import authMiddleWare from '../../utils/authMiddleWare';

const clientRoutHandler = (router: Router) => {
  // get all client service
  router.get('/client/service', authMiddleWare, clientController.handleGetAllService);

};

export default clientRoutHandler;