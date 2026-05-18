import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './shared/config/socket';
import { errorHandler, notFound } from './shared/middleware/errorHandler';
import { apiLimiter } from './shared/middleware/rateLimiter';

// Rutas
import voiceRoutes from './modules/voice/voice.routes';
import chatRoutes from './modules/chat/chat.routes';
import recommendationRoutes from './modules/recommendations/recommendations.routes';
import webhookRoutes from './modules/webhooks/webhooks.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middlewares globales
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'VoiceFinance API running', version: '2.0' });
});

// Rutas Persona D
app.use('/api/voice', voiceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 y error handler (siempre al final)
app.use(notFound);
app.use(errorHandler);

// Servidor HTTP + Socket.io
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`? Servidor corriendo en http://localhost:${PORT}`);
  console.log(`? Socket.io activo`);
});

export default app;
