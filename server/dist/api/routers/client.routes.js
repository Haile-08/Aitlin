"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const authMiddleWare_1 = __importDefault(require("../../utils/authMiddleWare"));
const clientRoutHandler = (router) => {
    // get all client service
    router.get('/client/service', authMiddleWare_1.default, __1.clientController.handleGetAllService);
    router.get('/client/notification', authMiddleWare_1.default, __1.clientController.handleGetAllNotification);
    router.put('/client/notification', authMiddleWare_1.default, __1.clientController.handleUpdateNotification);
};
exports.default = clientRoutHandler;
//# sourceMappingURL=client.routes.js.map