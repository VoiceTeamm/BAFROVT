"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authGuard_1 = require("../../shared/middleware/authGuard");
const voice_controller_1 = require("./voice.controller");
const router = (0, express_1.Router)();
// Multer en memoria (no guarda en disco, más seguro y simple)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB (límite de Whisper)
    fileFilter: (_req, file, cb) => {
        const allowed = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(`Formato de audio no soportado: ${file.mimetype}`));
        }
    },
});
// POST /api/voice/transcribe
// Body: FormData con campo "audio" (archivo de audio)
router.post('/transcribe', authGuard_1.authGuard, upload.single('audio'), voice_controller_1.transcribeHandler);
exports.default = router;
