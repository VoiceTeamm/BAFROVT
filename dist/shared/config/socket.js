"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const logger_1 = require("../utils/logger");
let io;
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    // Middleware JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error('Token de autenticacion requerido'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userEmail = decoded.email;
            next();
        }
        catch {
            next(new Error('Token invalido o expirado'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        logger_1.logger.info(`Socket conectado: userId=${userId}`);
        // Unir a sala privada
        socket.join(`user:${userId}`);
        // Evento: cliente envia mensaje de chat
        socket.on('chat:message', async (data) => {
            try {
                if (!data?.message?.trim())
                    return;
                // Emitir indicador de escritura
                socket.emit('chat:typing', { typing: true });
                // Guardar mensaje del usuario
                await prisma_1.prisma.agentMessage.create({
                    data: { userId, role: 'USER', content: data.message },
                });
                // Importar dinamicamente para no crear instancia de OpenAI al inicio
                const { sendChatMessage } = await Promise.resolve().then(() => __importStar(require('../../modules/chat/chat.service')));
                const reply = await sendChatMessage(userId, data.message, []);
                // Emitir respuesta al cliente
                socket.emit('chat:typing', { typing: false });
                socket.emit('chat:response', {
                    message: reply,
                    role: 'ASSISTANT',
                    timestamp: new Date().toISOString(),
                });
                logger_1.logger.info(`Chat respondido para userId=${userId}`);
            }
            catch (error) {
                logger_1.logger.error('Error en chat:message', error);
                socket.emit('chat:typing', { typing: false });
                socket.emit('chat:error', { message: 'Error al procesar el mensaje' });
            }
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(`Socket desconectado: userId=${userId}`);
        });
    });
    logger_1.logger.info('Socket.io inicializado');
    return io;
}
function getIO() {
    if (!io)
        throw new Error('Socket.io no ha sido inicializado');
    return io;
}
