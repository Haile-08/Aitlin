"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const authRoutHandler = (router) => {
    // Test express app
    router.get('/', __1.authController.testConnection);
};
exports.default = authRoutHandler;
//# sourceMappingURL=auth.routes.js.map