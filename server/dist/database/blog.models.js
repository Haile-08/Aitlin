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
    Name: {
        type: String,
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
        required: true,
    },
    fileDate: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
        }
    },
    date: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
        }
    }
});
exports.default = mongoose_1.default.model('Blog', blogSchema);
//# sourceMappingURL=blog.models.js.map