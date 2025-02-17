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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
/* Represent a client controller*/
class clientController {
    /**
      * test the express api
      * @param req request object
      * @param res response object
      */
    static handleGetAllService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNum = Number(req.query.page) || 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const searchTerm = req.query.search || '.*';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const clientId = req.query.clientId || '';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bar = req.query.bar || 'client';
                const servicePerPage = 9;
                const query = {
                    $or: [
                        { email: { $regex: searchTerm, $options: 'i' } },
                        { serviceName: { $regex: searchTerm, $options: 'i' } },
                        { clientName: { $regex: searchTerm, $options: 'i' } }
                    ]
                };
                // Include clientId in the query if it's provided
                if (clientId) {
                    query.clientId = clientId;
                }
                // Determine sorting field
                const sortField = bar === 'client' ? 'clientName' : bar === 'service' ? 'serviceName' : 'email';
                const services = yield database_1.Service.find(query).sort({ [sortField]: 1 }).skip(pageNum * servicePerPage).limit(servicePerPage);
                const startIndex = pageNum * servicePerPage;
                const endIndex = startIndex + servicePerPage;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const serviceList = services.slice(startIndex, endIndex).map((service) => service.toObject());
                res.status(200).json({
                    message: 'Services fetched successfully',
                    success: true,
                    data: serviceList,
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
      * get all notification
      * @param req request object
      * @param res response object
      */
    static handleGetAllNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const clientId = req.query.clientId || '';
                const notifications = yield database_1.Notification.find({ clientId: clientId, read: false });
                res.status(200).json({
                    message: 'notifications fetched successfully',
                    success: true,
                    data: notifications,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
      * get all notification
      * @param req request object
      * @param res response object
      */
    static handleUpdateNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const updatedNotification = yield database_1.Notification.findOneAndUpdate({ _id: id }, { $set: { read: true } }, { new: true });
                res.status(200).json({
                    message: 'notifications updated successfully',
                    success: true,
                    data: updatedNotification,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
    /**
      * get all notification
      * @param req request object
      * @param res response object
      */
    static handleUpdateDocumentNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                const updatedService = yield database_1.Service.findOneAndUpdate({ _id: id }, { $set: { Notification: status } }, { new: true });
                if (!updatedService) {
                    return res.status(404).json({ message: 'Service not found', success: false });
                }
                res.status(200).json({
                    message: 'notifications updated successfully',
                    success: true,
                    data: updatedService,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        });
    }
}
exports.default = clientController;
//# sourceMappingURL=client.controller.js.map