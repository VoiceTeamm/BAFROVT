import rateLimit from 'express-rate-limit';

// Limite general para la API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    error: {
      message: 'Demasiadas solicitudes, intenta de nuevo en 15 minutos.',
      code: 'RATE_LIMIT_EXCEEDED',
      status: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite estricto para auth (evitar fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    error: {
      message: 'Demasiados intentos de autenticacion, intenta de nuevo en 15 minutos.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      status: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
