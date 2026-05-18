/**
 * NOTA PARA PERSONA C:
 * Este archivo muestra cómo registrar las rutas de Persona D en el servidor Express.
 * Persona C crea el servidor principal (src/app.ts o src/server.ts).
 * Persona D solo necesita que este archivo sea referenciado.
 *
 * Agrega estas líneas en el archivo principal de Persona C:
 */

// ── Importaciones de módulos Persona D ──────────────────────────────────────
import voiceRoutes from './modules/voice/voice.routes';
import chatRoutes from './modules/chat/chat.routes';
import recommendationRoutes from './modules/recommendations/recommendations.routes';
import webhookRoutes from './modules/webhooks/webhooks.routes';
import { initSocket } from './shared/config/socket';

// ── Cómo registrar rutas (agregar en app.ts de Persona C) ───────────────────
// app.use('/api/voice', voiceRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/recommendations', recommendationRoutes);
// app.use('/api/webhooks', webhookRoutes);

// ── Cómo inicializar Socket.io (agregar en server.ts de Persona C) ───────────
// const httpServer = createServer(app);
// initSocket(httpServer);
// httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { voiceRoutes, chatRoutes, recommendationRoutes, webhookRoutes, initSocket };
