import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env';

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
    io = new SocketServer(httpServer, {
        cors: {
            origin: env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Middleware de autenticacion JWT para Socket.io
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth?.token as string | undefined;

        if (!token) {
            return next(new Error('Token de autenticacion requerido'));
        }

        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
            (socket as any).userId = decoded.userId;
            next();
        } catch {
            next(new Error('Token invalido o expirado'));
        }
    });

    return io;
}

export function getIO(): SocketServer {
    if (!io) {
        throw new Error('Socket.io no ha sido inicializado');
    }
    return io;
}

export { io };
