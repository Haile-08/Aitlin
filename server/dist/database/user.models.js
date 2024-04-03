"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        min: 1,
    },
    lastName: {
        type: String,
        min: 1,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        min: 8,
    },
    date: {
        type: String,
        min: 1,
    },
});
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.models.js.map