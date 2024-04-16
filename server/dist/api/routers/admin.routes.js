"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const authMiddleWare_1 = __importDefault(require("../../utils/authMiddleWare"));
const adminRoutHandler = (router) => {
    // add new client route
    router.post('/admin/add', authMiddleWare_1.default, __1.adminController.handleAddClient);
    // get all the clients route
    router.get('/admin/service', authMiddleWare_1.default, __1.adminController.handleGetAllClient);
    // update the status of the service
    router.put('/admin/service/status', authMiddleWare_1.default, __1.adminController.handleServiceStatus);
};
exports.default = adminRoutHandler;
//# sourceMappingURL=admin.routes.js.map