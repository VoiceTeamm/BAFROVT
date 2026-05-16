import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware de autenticación JWT para Socket.io
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error('Token de autenticación requerido'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      (socket as any).userId = decoded.id;
      next();
    } catch {
      next(new Error('Token inválido o expirado'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as string;
    console.log(`🔌 Socket conectado: userId=${userId}`);

    // Unir al usuario a su sala privada para recibir eventos personalizados
    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket desconectado: userId=${userId}`);
    });
  });

  console.log('✅ Socket.io inicializado');
  return io;
}

export function getIO(): SocketServer {
  if (!io) {
    throw new Error('Socket.io no ha sido inicializado. Llama initSocket() primero.');
  }
  return io;
}
