"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const config_1 = require("./config");
const api_1 = require("./api");
const app = (0, express_1.default)();
// connect to mongodb
(0, config_1.expressConnectDB)();
// handle express middleware
(0, utils_1.expressMiddleWareHandler)(app);
// handle express routes
(0, api_1.expressRouteHandler)(app);
// handle global errors
(0, utils_1.expressGlobalErrorHandler)(app);
// handle express initialization
(0, utils_1.serverInitHandler)(app);
exports.default = app;
//# sourceMappingURL=index.js.map