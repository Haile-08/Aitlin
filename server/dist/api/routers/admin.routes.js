"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const authMiddleWare_1 = __importDefault(require("../../utils/authMiddleWare"));
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../../utils");
const adminRoutHandler = (router) => {
    const multerUpload = (0, multer_1.default)({ storage: utils_1.storage }).single('file');
    // add new client route
    router.post('/admin/add', authMiddleWare_1.default, __1.adminController.handleAddClient);
    // get all the clients route
    router.get('/admin/service', authMiddleWare_1.default, __1.adminController.handleGetAllClient);
    // update the status of the service
    router.put('/admin/service/status', authMiddleWare_1.default, __1.adminController.handleServiceStatus);
    // add a new bill
    router.post('/admin/service/bill', authMiddleWare_1.default, multerUpload, __1.adminController.handleAddNewBill);
    // add a new bill
    router.post('/admin/service/binnacle', authMiddleWare_1.default, multerUpload, __1.adminController.handleAddNewBinnacle);
    // add a new bill
    router.post('/admin/service/Nurses', authMiddleWare_1.default, multerUpload, __1.adminController.handleAddNewNurses);
    // get all the service bill
    router.get('/admin/service/bill', authMiddleWare_1.default, __1.adminController.handleGetAllBill);
    // get all the service bill
    router.get('/admin/service/binnacle', authMiddleWare_1.default, __1.adminController.handleGetAllBinnacle);
    // get all the service bill
    router.get('/admin/service/nurses', authMiddleWare_1.default, __1.adminController.handleGetAllNurse);
    // update the service bill
    router.put('/admin/service/bill', authMiddleWare_1.default, multerUpload, __1.adminController.handleUpdateABill);
    // update the service bill
    router.put('/admin/service/binnacle', authMiddleWare_1.default, multerUpload, __1.adminController.handleUpdateABinnacle);
    // update the service bill
    router.put('/admin/service/nurses', authMiddleWare_1.default, multerUpload, __1.adminController.handleUpdateANurse);
};
exports.default = adminRoutHandler;
//# sourceMappingURL=admin.routes.js.map