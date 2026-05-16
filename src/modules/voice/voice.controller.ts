import { Request, Response, NextFunction } from 'express';
import { transcribeAudio, extractTransactionEntity } from './voice.service';

export async function transcribeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se recibió archivo de audio.' });
      return;
    }

    // 1. Whisper STT: audio → texto
    const transcribedText = await transcribeAudio(req.file.buffer, req.file.mimetype);

    // 2. NLP con GPT-4o: texto → entidad estructurada
    const entity = await extractTransactionEntity(transcribedText);

    res.status(200).json({
      transcription: transcribedText,
      entity,
    });
  } catch (error) {
    next(error);
  }
}
