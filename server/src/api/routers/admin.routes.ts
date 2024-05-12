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

  // get all the clients route
  router.get('/admin/service/get', authMiddleWare, adminController.handleGetASingleService);

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

  // update the service bill
  router.put('/admin/service/bill', authMiddleWare, multerUpload, adminController.handleUpdateABill);

  // update the service bill
  router.put('/admin/service/binnacle', authMiddleWare, multerUpload, adminController.handleUpdateABinnacle);
  
  // update the service bill
  router.put('/admin/service/nurses', authMiddleWare, multerUpload, adminController.handleUpdateANurse);

  // delete a bill
  router.delete('/admin/service/bill/:id', authMiddleWare, adminController.handleDeleteBill);
  
  // delete a bill
  router.delete('/admin/service/binnacle/:id', authMiddleWare, adminController.handleDeleteBinnacle);

  // delete a bill
  router.delete('/admin/service/nurses/:id', authMiddleWare, adminController.handleDeleteNurse);

};

export default adminRoutHandler;