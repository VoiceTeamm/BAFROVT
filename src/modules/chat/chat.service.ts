import OpenAI from 'openai';
import { prisma } from '../../shared/config/prisma';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Eres VoiceFinance AI, un asistente financiero inteligente para micro-emprendedores bolivianos.
Tu rol es ayudar a registrar ventas y gastos, analizar tendencias financieras y dar recomendaciones de precios.

Reglas:
- Responde siempre en español, de forma clara y concisa.
- Si el usuario menciona una venta o gasto, confirma que lo registrarás y extrae los datos.
- Puedes dar consejos financieros simples basados en el contexto del negocio.
- No inventes datos financieros que no te hayan dado.
- Si no tienes información suficiente, pregunta amablemente.
- Usa unidades bolivianas (Bs) para montos.`;

/**
 * Envía un mensaje al agente GPT-4o con historial de conversación.
 * Guarda el mensaje y la respuesta en la tabla agent_messages.
 */
export async function sendChatMessage(
  userId: string,
  message: string,
  clientHistory: ChatMessage[]
): Promise<string> {
  // Cargar los últimos 20 mensajes del historial desde la BD
  const dbHistory = await prisma.agentMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  // Convertir a formato OpenAI (más recientes al final)
  const historyMessages: OpenAI.ChatCompletionMessageParam[] = dbHistory
    .reverse()
    .map((msg) => ({
      role: msg.role.toLowerCase() as 'user' | 'assistant',
      content: msg.content,
    }));

  // Si el cliente envía historial (para contexto inmediato), lo mezclamos
  // Prioridad: historial BD + mensaje actual
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...historyMessages,
    { role: 'user', content: message },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
    max_tokens: 500,
  });

  const reply = response.choices[0].message.content ?? 'No pude generar una respuesta.';

  // Guardar mensaje del usuario y respuesta en BD
  await prisma.agentMessage.createMany({
    data: [
      { userId, role: 'USER', content: message },
      { userId, role: 'ASSISTANT', content: reply },
    ],
  });

  return reply;
}
