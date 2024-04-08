"use strict";
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
const database_1 = require("../../database");
const utils_1 = require("../../utils");
/* Represent a run time controller*/
class adminController {
    /**
       * add a new client
       * @param req request object
       * @param res response object
       */
    static handleAddClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Name, status, Service, email, Notification } = req.body;
                if (!email || !Name || !status || !Service || !Notification) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const existingUser = yield database_1.User.findOne({ email });
                if (existingUser && status == 'new') {
                    return res.json({ message: 'Client already exists' });
                }
                const salt = yield bcrypt_1.default.genSalt();
                const password = Math.random().toString(36).slice(2, 10);
                const passwordHash = yield bcrypt_1.default.hash(password, salt);
                const client = yield database_1.User.create({
                    Name,
                    email,
                    password: passwordHash,
                    type: 'client',
                    status: true,
                });
                if (status == 'new') {
                    (0, utils_1.sendEmail)(client.email, 'New Client', {
                        name: client.Name,
                        email: client.email,
                        password,
                        link: undefined
                    }, './template/newClient.handlebars');
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (err) {
                return res.status(500).json({ message: err.message, success: false });
            }
        });
    }
}
exports.default = adminController;
//# sourceMappingURL=admin.controller.js.map