"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Handle express global error
 * @param app express app
 */
const expressGlobalErrorHandler = (app) => {
    // Global error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message,
        });
    });
};
exports.default = expressGlobalErrorHandler;
//# sourceMappingURL=expressGlobalErrorHandler.js.map