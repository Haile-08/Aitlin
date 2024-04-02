"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URL = exports.JWT_SECRET = exports.ENV_STAT = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const status = 'development';
if (status === 'development') {
    // Development environment variables
    dotenv_1.default.config();
}
else {
    // Production environment variables
    const configPath = './.env.prod';
    dotenv_1.default.config({ path: configPath });
}
exports.PORT = process.env.PORT;
exports.ENV_STAT = process.env.ENV_STAT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.MONGO_URL = process.env.MONGO_URL;
//# sourceMappingURL=envConfig.js.map