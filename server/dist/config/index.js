"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedOrigins = exports.expressConnectDB = exports.FROM_EMAIL = exports.EMAIL_PASSWORD = exports.EMAIL_USERNAME = exports.EMAIL_HOST = exports.JWT_SECRET = exports.MONGO_URL = exports.ENV_STAT = exports.PORT = void 0;
// env exports
var envConfig_1 = require("./envConfig");
Object.defineProperty(exports, "PORT", { enumerable: true, get: function () { return envConfig_1.PORT; } });
var envConfig_2 = require("./envConfig");
Object.defineProperty(exports, "ENV_STAT", { enumerable: true, get: function () { return envConfig_2.ENV_STAT; } });
var envConfig_3 = require("./envConfig");
Object.defineProperty(exports, "MONGO_URL", { enumerable: true, get: function () { return envConfig_3.MONGO_URL; } });
var envConfig_4 = require("./envConfig");
Object.defineProperty(exports, "JWT_SECRET", { enumerable: true, get: function () { return envConfig_4.JWT_SECRET; } });
var envConfig_5 = require("./envConfig");
Object.defineProperty(exports, "EMAIL_HOST", { enumerable: true, get: function () { return envConfig_5.EMAIL_HOST; } });
var envConfig_6 = require("./envConfig");
Object.defineProperty(exports, "EMAIL_USERNAME", { enumerable: true, get: function () { return envConfig_6.EMAIL_USERNAME; } });
var envConfig_7 = require("./envConfig");
Object.defineProperty(exports, "EMAIL_PASSWORD", { enumerable: true, get: function () { return envConfig_7.EMAIL_PASSWORD; } });
var envConfig_8 = require("./envConfig");
Object.defineProperty(exports, "FROM_EMAIL", { enumerable: true, get: function () { return envConfig_8.FROM_EMAIL; } });
// db connection
var dbConfig_1 = require("./dbConfig");
Object.defineProperty(exports, "expressConnectDB", { enumerable: true, get: function () { return __importDefault(dbConfig_1).default; } });
// cors
var allowedOrigin_1 = require("./allowedOrigin");
Object.defineProperty(exports, "allowedOrigins", { enumerable: true, get: function () { return __importDefault(allowedOrigin_1).default; } });
//# sourceMappingURL=index.js.map