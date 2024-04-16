import { adminController} from '..';
import { Router } from 'express';
import authMiddleWare from '../../utils/authMiddleWare';
import multer from 'multer';
import { storage } from '../../utils';

const adminRoutHandler = (router: Router) => {
  const multerUpload = multer({storage: storage}).single('file');

  // add new client route
  router.post('/admin/add',authMiddleWare, adminController.handleAddClient);

  // get all the clients route
  router.get('/admin/service', authMiddleWare, adminController.handleGetAllClient);

  // update the status of the service
  router.put('/admin/service/status', authMiddleWare, adminController.handleServiceStatus);

  // add a new bill
  router.post('/admin/service/bill', authMiddleWare, multerUpload, adminController.handleAddNewBill);

  // add a new bill
  router.post('/admin/service/binnacle', authMiddleWare, multerUpload, adminController.handleAddNewBinnacle);

  // add a new bill
  router.post('/admin/service/Nurses', authMiddleWare, multerUpload, adminController.handleAddNewNurses);

  // get all the service bill
  router.get('/admin/service/bill', authMiddleWare, adminController.handleGetAllBill);

  // get all the service bill
  router.get('/admin/service/binnacle', authMiddleWare, adminController.handleGetAllBinnacle);
  
  // get all the service bill
  router.get('/admin/service/nurses', authMiddleWare, adminController.handleGetAllNurse);
};

export default adminRoutHandler;