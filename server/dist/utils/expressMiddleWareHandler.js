"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../config");
/**
 * Express server middleware
 * @param app express app
 */
const expressMiddleWareHandler = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)(config_1.allowedOrigins));
};
exports.default = expressMiddleWareHandler;
//# sourceMappingURL=expressMiddleWareHandler.js.map