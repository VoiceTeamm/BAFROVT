"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = transcribeAudio;
exports.extractTransactionEntity = extractTransactionEntity;
const openai_1 = __importDefault(require("openai"));
function getOpenAI() {
    return new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
}
async function transcribeAudio(buffer, mimetype) {
    const audioFile = new File([buffer], 'audio.webm', { type: mimetype });
    const response = await getOpenAI().audio.transcriptions.create({
        model: 'whisper-1',
        file: audioFile,
        language: 'es',
    });
    return response.text;
}
async function extractTransactionEntity(text) {
    const systemPrompt = `Eres un extractor de datos financieros para micro-emprendedores bolivianos.
Dado un texto en espa?ol, extrae la informaci��n de una transacci��n y responde ��NICAMENTE en JSON v��lido.
Sin texto adicional, sin markdown, solo JSON puro.
Esquema: {"tipo":"venta"|"gasto"|null,"producto":string|null,"cantidad":number|null,"monto":number|null,"nota":string|null}`;
    const response = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
        ],
        temperature: 0,
        max_tokens: 200,
    });
    const raw = response.choices[0].message.content ?? '{}';
    try {
        return JSON.parse(raw);
    }
    catch {
        return { tipo: null, producto: null, cantidad: null, monto: null, nota: raw };
    }
}
