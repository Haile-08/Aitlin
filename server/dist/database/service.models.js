"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const serviceSchema = new Schema({
    clientId: {
        type: String,
        min: 1,
    },
    clientName: {
        type: String,
        min: 1,
    },
    serviceName: {
        type: String,
        min: 1,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    billArchive: {
        type: String,
        default: '',
    },
    nurseArchive: {
        type: String,
        default: '',
    },
    blogArchive: {
        type: String,
        default: '',
    },
    Notification: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Service', serviceSchema);
//# sourceMappingURL=service.models.js.map