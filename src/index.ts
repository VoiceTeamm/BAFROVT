import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './shared/middleware/errorHandler';
import authRouter from './modules/auth/auth.routes';
import transactionRouter from './modules/transactions/transaction.routes'; // ← Agrega esto
import { authGuard, AuthRequest } from './shared/middleware/authGuard';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter); // ← Agrega esto

// Ruta protegida de prueba
app.get('/api/protected', authGuard, (req: AuthRequest, res) => {
    res.json({
        message: '✅ Acceso concedido',
        userId: req.userId
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 VoiceFinance API corriendo en http://localhost:${PORT}`);
});