"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Limite general para la API
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: {
        error: {
            message: 'Demasiadas solicitudes, intenta de nuevo en 15 minutos.',
            code: 'RATE_LIMIT_EXCEEDED',
            status: 429,
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Limite estricto para auth (evitar fuerza bruta)
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: {
        error: {
            message: 'Demasiados intentos de autenticacion, intenta de nuevo en 15 minutos.',
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            status: 429,
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
