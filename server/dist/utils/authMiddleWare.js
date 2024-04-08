"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }
    if (!config_1.JWT_SECRET) {
        return res.sendStatus(403); // Forbidden
    }
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        next();
    });
};
exports.default = authMiddleWare;
//# sourceMappingURL=authMiddleWare.js.map