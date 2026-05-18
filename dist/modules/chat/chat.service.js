"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChatMessage = sendChatMessage;
const openai_1 = __importDefault(require("openai"));
const prisma_1 = require("../../shared/config/prisma");
function getOpenAI() {
    return new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
}
const SYSTEM_PROMPT = `Eres VoiceFinance AI, un asistente financiero inteligente para micro-emprendedores bolivianos.
Tu rol es ayudar a registrar ventas y gastos, analizar tendencias financieras y dar recomendaciones de precios.
Reglas:
- Responde siempre en espa?ol, de forma clara y concisa.
- Si el usuario menciona una venta o gasto, confirma que lo registrar��s y extrae los datos.
- Usa unidades bolivianas (Bs) para montos.`;
async function sendChatMessage(userId, message, clientHistory) {
    const dbHistory = await prisma_1.prisma.agentMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
    const historyMessages = dbHistory
        .reverse()
        .map((msg) => ({
        role: msg.role.toLowerCase(),
        content: msg.content,
    }));
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...historyMessages,
        { role: 'user', content: message },
    ];
    const response = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 500,
    });
    const reply = response.choices[0].message.content ?? 'No pude generar una respuesta.';
    await prisma_1.prisma.agentMessage.createMany({
        data: [
            { userId, role: 'USER', content: message },
            { userId, role: 'ASSISTANT', content: reply },
        ],
    });
    return reply;
}
