import { Router } from 'express';
import multer from 'multer';
import { authGuard } from '../../shared/middleware/authGuard';
import { transcribeHandler } from './voice.controller';

const router = Router();

// Multer en memoria (no guarda en disco, más seguro y simple)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB (límite de Whisper)
  fileFilter: (_req, file, cb) => {
    const allowed = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Formato de audio no soportado: ${file.mimetype}`));
    }
  },
});

// POST /api/voice/transcribe
// Body: FormData con campo "audio" (archivo de audio)
router.post('/transcribe', authGuard, upload.single('audio'), transcribeHandler);

export default router;
