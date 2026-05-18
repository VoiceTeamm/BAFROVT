"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./shared/middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const transaction_routes_1 = __importDefault(require("./modules/transactions/transaction.routes")); // ← Agrega esto
const authGuard_1 = require("./shared/middleware/authGuard");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default); // ← Agrega esto
// Ruta protegida de prueba
app.get('/api/protected', authGuard_1.authGuard, (req, res) => {
    res.json({
        message: '✅ Acceso concedido',
        userId: req.userId
    });
});
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 VoiceFinance API corriendo en http://localhost:${PORT}`);
});
