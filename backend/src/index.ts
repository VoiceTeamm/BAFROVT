import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { errorHandler } from './shared/middleware/errorHandler';
import { initSocket } from './shared/config/socket';
import authRouter from './modules/auth/auth.routes';
import transactionRouter from './modules/transactions/transaction.routes';
import categoryRouter from './modules/categories/category.routes';
import { alertRouter } from './modules/alerts/alert.routes';
import recommendationRoutes from './modules/recommendations/recommendations.routes';
import chatRoutes from './modules/chat/chat.routes';
import voiceRoutes from './modules/voice/voice.routes';
import webhookRoutes from './modules/webhooks/webhooks.routes';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/alerts', alertRouter);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/webhooks', webhookRoutes);

app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`🚀 VoiceFinance API corriendo en http://localhost:${PORT}`);
    console.log(`🔌 Socket.io activo`);
});

export default app;
