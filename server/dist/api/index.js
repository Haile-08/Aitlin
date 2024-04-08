"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.authController = exports.adminRoutHandler = exports.authRoutHandler = exports.expressRouteHandler = void 0;
// express route
var index_routes_1 = require("./routers/index.routes");
Object.defineProperty(exports, "expressRouteHandler", { enumerable: true, get: function () { return __importDefault(index_routes_1).default; } });
var auth_routes_1 = require("./routers/auth.routes");
Object.defineProperty(exports, "authRoutHandler", { enumerable: true, get: function () { return __importDefault(auth_routes_1).default; } });
var admin_routes_1 = require("./routers/admin.routes");
Object.defineProperty(exports, "adminRoutHandler", { enumerable: true, get: function () { return __importDefault(admin_routes_1).default; } });
// express controller
var auth_controller_1 = require("./controllers/auth.controller");
Object.defineProperty(exports, "authController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var admin_controller_1 = require("./controllers/admin.controller");
Object.defineProperty(exports, "adminController", { enumerable: true, get: function () { return __importDefault(admin_controller_1).default; } });
//# sourceMappingURL=index.js.map