"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const notificationSchema = new Schema({
    serviceId: {
        type: String,
        min: 1,
    },
    clientId: {
        type: String,
        min: 1,
    },
    link1: {
        type: String,
        min: 1,
    },
    link2: {
        type: String,
        min: 1,
    },
    type: {
        type: String,
        min: 1,
    },
    read: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
        }
    }
});
exports.default = mongoose_1.default.model('Notification', notificationSchema);
//# sourceMappingURL=notification.models.js.map