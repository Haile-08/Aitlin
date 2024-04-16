"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const blogSchema = new Schema({
    serviceId: {
        type: String,
        min: 1,
    },
    period: {
        type: String,
        min: 1,
    },
    comment: {
        type: String,
        min: 1,
    },
    files: {
        type: String,
        min: 1,
    },
    date: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Blog', blogSchema);
//# sourceMappingURL=blog.models.js.map