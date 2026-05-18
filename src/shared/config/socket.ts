import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware JWT
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Token de autenticacion requerido'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
      (socket as any).userId = decoded.id;
      (socket as any).userEmail = decoded.email;
      next();
    } catch {
      next(new Error('Token invalido o expirado'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as string;
    logger.info(`Socket conectado: userId=${userId}`);

    // Unir a sala privada
    socket.join(`user:${userId}`);

    // Evento: cliente envia mensaje de chat
    socket.on('chat:message', async (data: { message: string }) => {
      try {
        if (!data?.message?.trim()) return;

        // Emitir indicador de escritura
        socket.emit('chat:typing', { typing: true });

        // Guardar mensaje del usuario
        await prisma.agentMessage.create({
          data: { userId, role: 'USER', content: data.message },
        });

        // Importar dinamicamente para no crear instancia de OpenAI al inicio
        const { sendChatMessage } = await import('../../modules/chat/chat.service');
        const reply = await sendChatMessage(userId, data.message, []);

        // Emitir respuesta al cliente
        socket.emit('chat:typing', { typing: false });
        socket.emit('chat:response', {
          message: reply,
          role: 'ASSISTANT',
          timestamp: new Date().toISOString(),
        });

        logger.info(`Chat respondido para userId=${userId}`);
      } catch (error) {
        logger.error('Error en chat:message', error);
        socket.emit('chat:typing', { typing: false });
        socket.emit('chat:error', { message: 'Error al procesar el mensaje' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket desconectado: userId=${userId}`);
    });
  });

  logger.info('Socket.io inicializado');
  return io;
}

export function getIO(): SocketServer {
  if (!io) throw new Error('Socket.io no ha sido inicializado');
  return io;
}
