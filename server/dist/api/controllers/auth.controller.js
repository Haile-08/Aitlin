"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../database");
const config_1 = require("../../config");
const utils_1 = require("../../utils");
const crypto = __importStar(require("crypto"));
/* Represent a run time controller*/
class authController {
    /**
     * test the express api
     * @param req request object
     * @param res response object
     */
    static testConnection(req, res) {
        res.status(200).json({ data: 'server working' });
    }
    /**
     * login user
     * @param req request object
     * @param res response object
     */
    static loginHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const user = yield database_1.User.findOne({ email });
                if (!user) {
                    return res.json({
                        message: 'Email not found',
                        success: false
                    });
                }
                if (!user.password) {
                    return res.json({
                        message: 'User do not have a password',
                        success: false
                    });
                }
                const isCorrect = bcrypt_1.default.compare(password, user.password);
                if (!isCorrect) {
                    return res.json({
                        message: 'incorrect password',
                        success: false,
                    });
                }
                if (!config_1.JWT_SECRET) {
                    return res.status(500).json({
                        message: 'JWT_SECRET is not defined',
                        success: false
                    });
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET);
                return res.status(201).json({
                    message: 'User logged in successfully',
                    success: true,
                    data: {
                        user,
                        token,
                    }
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (err) {
                return res.status(500).json({ message: err.message, success: false });
            }
        });
    }
    /**
     * request for password reset
     * @param req request object
     * @param res response object
     */
    static passwordResetRequestHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield database_1.User.findOne({ email });
            // check if there is a user
            if (!user) {
                return res.json({
                    message: 'User does not exist',
                    success: false,
                });
            }
            const token = yield database_1.Token.findOne({ userId: user._id });
            // if token exists delete
            if (token) {
                yield token.deleteOne();
            }
            const resetToken = crypto.randomBytes(64).toString('hex');
            if (!config_1.JWT_SECRET) {
                return res.status(500).json({
                    message: 'JWT_SECRET is not defined',
                    success: false
                });
            }
            const hash = yield bcrypt_1.default.hash(resetToken, Number(10));
            yield new database_1.Token({
                userId: user._id,
                token: hash,
                createdAt: Date.now(),
            }).save();
            const link = `http://localhost:5173/password/reset/${resetToken}/${user._id}`;
            (0, utils_1.sendEmail)(user.email, 'Password Reset Request', {
                name: user.Name,
                link: link,
                email: undefined,
                password: undefined
            }, './template/requestPassowrdReset.handlebars');
            res.status(201).json({
                message: 'reset email sent',
                success: true,
            });
        });
    }
    /**
     * reset password
     * @param req request object
     * @param res response object
     */
    static passwordResetHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, token, password } = req.body;
            const userReset = yield database_1.Token.findOne({ userId });
            if (!userReset) {
                return res.json({
                    message: 'Invalid or expired password reset token',
                    success: false
                });
            }
            const isValid = yield bcrypt_1.default.compare(token, userReset.token);
            if (!isValid) {
                return res.json({
                    message: 'Invalid or expired password reset token',
                    success: false
                });
            }
            const salt = yield bcrypt_1.default.genSalt();
            const hash = yield bcrypt_1.default.hash(password, salt);
            yield database_1.User.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });
            const user = yield database_1.User.findById({ _id: userId });
            // check if there is a user
            if (!user) {
                return res.json({
                    message: 'User does not exist',
                    success: false,
                });
            }
            (0, utils_1.sendEmail)(user.email, 'Password Reset Successfully', {
                name: user.Name,
                link: undefined,
                email: undefined,
                password: undefined
            }, './template/resetPassword.handlebars');
            yield userReset.deleteOne();
            res.status(201).json({
                message: 'reset email sent',
                success: true
            });
        });
    }
}
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map