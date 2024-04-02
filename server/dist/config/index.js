"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressConnectDB = exports.JWT_SECRET = exports.MONGO_URL = exports.ENV_STAT = exports.PORT = void 0;
// env exports
var envConfig_1 = require("./envConfig");
Object.defineProperty(exports, "PORT", { enumerable: true, get: function () { return envConfig_1.PORT; } });
var envConfig_2 = require("./envConfig");
Object.defineProperty(exports, "ENV_STAT", { enumerable: true, get: function () { return envConfig_2.ENV_STAT; } });
var envConfig_3 = require("./envConfig");
Object.defineProperty(exports, "MONGO_URL", { enumerable: true, get: function () { return envConfig_3.MONGO_URL; } });
var envConfig_4 = require("./envConfig");
Object.defineProperty(exports, "JWT_SECRET", { enumerable: true, get: function () { return envConfig_4.JWT_SECRET; } });
// db connection
var dbConfig_1 = require("./dbConfig");
Object.defineProperty(exports, "expressConnectDB", { enumerable: true, get: function () { return __importDefault(dbConfig_1).default; } });
//# sourceMappingURL=index.js.map