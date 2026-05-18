"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeHandler = transcribeHandler;
const voice_service_1 = require("./voice.service");
async function transcribeHandler(req, res, next) {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No se recibió archivo de audio.' });
            return;
        }
        // 1. Whisper STT: audio → texto
        const transcribedText = await (0, voice_service_1.transcribeAudio)(req.file.buffer, req.file.mimetype);
        // 2. NLP con GPT-4o: texto → entidad estructurada
        const entity = await (0, voice_service_1.extractTransactionEntity)(transcribedText);
        res.status(200).json({
            transcription: transcribedText,
            entity,
        });
    }
    catch (error) {
        next(error);
    }
}
