"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map