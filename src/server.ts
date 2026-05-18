import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './shared/config/socket';
import { errorHandler, notFound } from './shared/middleware/errorHandler';
import { apiLimiter } from './shared/middleware/rateLimiter';

import voiceRoutes from './modules/voice/voice.routes';
import chatRoutes from './modules/chat/chat.routes';
import recommendationRoutes from './modules/recommendations/recommendations.routes';
import webhookRoutes from './modules/webhooks/webhooks.routes';
import categoryRoutes from './modules/categories/categories.routes';
import alertRoutes from './modules/alerts/alerts.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'VoiceFinance API running', version: '2.0' });
});

app.use('/api/voice', voiceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/alerts', alertRoutes);

app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`? Servidor corriendo en http://localhost:${PORT}`);
  console.log(`? Socket.io activo`);
});

export default app;
