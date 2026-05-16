import { Request, Response, NextFunction } from 'express';
import { sendChatMessage } from './chat.service';

export async function chatHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user!.id;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'El campo "message" es requerido.' });
      return;
    }

    const reply = await sendChatMessage(userId, message, history);

    res.status(200).json({ reply });
  } catch (error) {
    next(error);
  }
}
