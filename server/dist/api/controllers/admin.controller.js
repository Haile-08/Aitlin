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
                const { Name, status, ServiceData, email, Notification } = req.body;
                if (!email || !Name || !status || !ServiceData) {
                    return res.json({
                        message: 'All fields are required',
                        success: false
                    });
                }
                const existingUser = yield database_1.User.findOne({ email });
                if (status == 'new') {
                    if (existingUser) {
                        return res.json({
                            message: 'Client already exists',
                            success: false,
                        });
                    }
                    const salt = yield bcrypt_1.default.genSalt();
                    const password = Math.random().toString(36).slice(2, 10);
                    const passwordHash = yield bcrypt_1.default.hash(password, salt);
                    const client = yield database_1.User.create({
                        Name,
                        email,
                        password: passwordHash,
                        type: 'client',
                        Notification,
                    });
                    const service = yield database_1.Service.create({
                        clientId: client._id,
                        clientName: client.Name,
                        serviceName: ServiceData,
                        email: client.email,
                        status: true,
                        Notification: Notification || false,
                    });
                    (0, utils_1.sendEmail)(client.email, 'Welcome to Aitlin', {
                        name: client.Name,
                        email: client.email,
                        password,
                        link: undefined
                    }, './template/newClient.handlebars');
                    return res.status(201).json({
                        message: 'Account created successfully',
                        success: true,
                        data: {
                            client,
                            service
                        },
                    });
                }
                else {
                    if (!existingUser) {
                        return res.json({
                            message: 'Client does not exists',
                            success: false,
                        });
                    }
                    const service = yield database_1.Service.create({
                        clientId: existingUser._id,
                        clientName: existingUser.Name,
                        serviceName: ServiceData,
                        email: existingUser.email,
                        status: true,
                        Notification: Notification || false,
                    });
                    return res.status(201).json({
                        message: 'Service created successfully',
                        success: true,
                        data: service,
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (err) {
                return res.status(500).json({ message: err.message, success: false });
            }
        });
    }
    /**
       * get all clients
       * @param req request object
       * @param res response object
       */
    static handleGetAllClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNum = Number(req.query.page) || 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                console.log('search', searchTerm);
                const servicePerPage = 9;
                const services = yield database_1.Service.find({ serviceName: { $regex: searchTerm, $options: 'i' } });
                const startIndex = pageNum * servicePerPage;
                const endIndex = startIndex + servicePerPage;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceList = services.slice(startIndex, endIndex).map((service) => service.toObject());
                console.log(services);
                res.status(200).json({
                    message: 'Services fetched successfully',
                    success: true,
                    services: serviceList,
                    hasMore: endIndex < services.length,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
       * update the service status
       * @param req request object
       * @param res response object
       */
    static handleServiceStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                console.log('id', id);
                console.log('status', status);
                const updatedService = yield database_1.Service.findByIdAndUpdate(id, { status }, { new: true });
                if (!updatedService) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                res.status(200).json({ message: 'Service status updated successfully', success: true, updatedService });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
}
exports.default = adminController;
//# sourceMappingURL=admin.controller.js.map