"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
/**
 * Express server middleware
 * @param app express app
 */
const expressMiddleWareHandler = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)(config_1.allowedOrigins));
    app.use((0, morgan_1.default)('common'));
    app.use(express_1.default.static('public'));
    app.use('/public', express_1.default.static(path_1.default.join(__dirname, '..', '..', 'public')));
};
exports.default = expressMiddleWareHandler;
//# sourceMappingURL=expressMiddleWareHandler.js.map