"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Handle express global error
 * @param app express app
 */
const expressGlobalErrorHandler = (app) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    app.use((error, _req, res, _next) => {
        const statusCode = error.statusCode || 500;
        const message = error.message;
        return res.status(statusCode).json({
            status: statusCode,
            message,
        });
    });
};
exports.default = expressGlobalErrorHandler;
//# sourceMappingURL=expressGlobalErrorHandler.js.map