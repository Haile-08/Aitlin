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
                const servicePerPage = 9;
                const services = yield database_1.Service.find({ serviceName: { $regex: searchTerm, $options: 'i' }, clientId: clientId });
                console.log('data', services);
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
}
exports.default = clientController;
//# sourceMappingURL=client.controller.js.map