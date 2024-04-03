"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const authRoutHandler = (router) => {
    // Test express app
    router.get('/', __1.authController.testConnection);
    // login route
    router.post('/login', __1.authController.loginHandler);
    // request to reset password
    router.post('/passwordResetRequest', __1.authController.passwordResetRequestHandler);
    // reset password
    router.post('/resetPassword', __1.authController.passwordResetHandler);
};
exports.default = authRoutHandler;
//# sourceMappingURL=auth.routes.js.map