"use strict";
/**
 * NOTA PARA PERSONA C:
 * Este archivo muestra cómo registrar las rutas de Persona D en el servidor Express.
 * Persona C crea el servidor principal (src/app.ts o src/server.ts).
 * Persona D solo necesita que este archivo sea referenciado.
 *
 * Agrega estas líneas en el archivo principal de Persona C:
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = exports.webhookRoutes = exports.recommendationRoutes = exports.chatRoutes = exports.voiceRoutes = void 0;
// ── Importaciones de módulos Persona D ──────────────────────────────────────
const voice_routes_1 = __importDefault(require("./modules/voice/voice.routes"));
exports.voiceRoutes = voice_routes_1.default;
const chat_routes_1 = __importDefault(require("./modules/chat/chat.routes"));
exports.chatRoutes = chat_routes_1.default;
const recommendations_routes_1 = __importDefault(require("./modules/recommendations/recommendations.routes"));
exports.recommendationRoutes = recommendations_routes_1.default;
const webhooks_routes_1 = __importDefault(require("./modules/webhooks/webhooks.routes"));
exports.webhookRoutes = webhooks_routes_1.default;
const socket_1 = require("./shared/config/socket");
Object.defineProperty(exports, "initSocket", { enumerable: true, get: function () { return socket_1.initSocket; } });
