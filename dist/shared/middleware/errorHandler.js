"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFound = notFound;
const logger_1 = require("../utils/logger");
function errorHandler(err, _req, res, _next) {
    const status = err.status ?? 500;
    const message = err.message ?? 'Internal Server Error';
    logger_1.logger.error(`${status} - ${message}`);
    res.status(status).json({
        error: {
            message,
            code: err.code ?? 'INTERNAL_ERROR',
            status,
        },
    });
}
function notFound(_req, res) {
    res.status(404).json({
        error: {
            message: 'Ruta no encontrada',
            code: 'NOT_FOUND',
            status: 404,
        },
    });
}
