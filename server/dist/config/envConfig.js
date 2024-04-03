"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FROM_EMAIL = exports.EMAIL_PASSWORD = exports.EMAIL_USERNAME = exports.EMAIL_HOST = exports.MONGO_URL = exports.JWT_SECRET = exports.ENV_STAT = exports.PORT = void 0;
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
exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.FROM_EMAIL = process.env.FROM_EMAIL;
//# sourceMappingURL=envConfig.js.map