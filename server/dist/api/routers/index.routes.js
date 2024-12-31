"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const __1 = require("..");
/**
 * route handler to the express application
 * @param app express app
 */
const expressRouteHandler = (app) => {
    const router = express_1.default.Router();
    // Api versioning
    app.use('/api/v1', router);
    // auth router
    (0, __1.authRoutHandler)(router);
    // admin router
    (0, __1.adminRoutHandler)(router);
    // client router
    (0, __1.clientRoutHandler)(router);
};
exports.default = expressRouteHandler;
//# sourceMappingURL=index.routes.js.map