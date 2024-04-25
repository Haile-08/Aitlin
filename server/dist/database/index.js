"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.Service = exports.Nurse = exports.Blog = exports.Bill = exports.Token = exports.User = void 0;
var user_models_1 = require("./user.models");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_models_1).default; } });
var token_models_1 = require("./token.models");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return __importDefault(token_models_1).default; } });
var bill_models_1 = require("./bill.models");
Object.defineProperty(exports, "Bill", { enumerable: true, get: function () { return __importDefault(bill_models_1).default; } });
var blog_models_1 = require("./blog.models");
Object.defineProperty(exports, "Blog", { enumerable: true, get: function () { return __importDefault(blog_models_1).default; } });
var nurse_models_1 = require("./nurse.models");
Object.defineProperty(exports, "Nurse", { enumerable: true, get: function () { return __importDefault(nurse_models_1).default; } });
var service_models_1 = require("./service.models");
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return __importDefault(service_models_1).default; } });
var notification_models_1 = require("./notification.models");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return __importDefault(notification_models_1).default; } });
//# sourceMappingURL=index.js.map