"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const nurseSchema = new Schema({
    serviceId: {
        type: String,
        min: 1,
    },
    comment: {
        type: String,
        min: 1,
    },
    Archive: {
        type: String,
        min: 1,
    },
    date: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Nurse', nurseSchema);
//# sourceMappingURL=nurse.models.js.map