import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal Server Error';

  console.error(`[ERROR] ${status} - ${message}`);

  res.status(status).json({
    error: {
      message,
      code: err.code ?? 'INTERNAL_ERROR',
      status,
    },
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: 'Ruta no encontrada',
      code: 'NOT_FOUND',
      status: 404,
    },
  });
}
