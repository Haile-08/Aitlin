"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path_1.default.extname(file.originalname);
        cb(null, 'FILE-' + file.fieldname + '-' + uniqueSuffix);
    },
});
exports.default = storage;
//# sourceMappingURL=multerStorage.js.map