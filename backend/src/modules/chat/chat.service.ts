import OpenAI from 'openai';
import { prisma } from '../../shared/config/prisma';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `Eres VoiceFinance AI, un asistente financiero inteligente para micro-emprendedores bolivianos.
Tu rol es ayudar a registrar ventas y gastos, analizar tendencias financieras y dar recomendaciones de precios.
Reglas:
- Responde siempre en espa?ol, de forma clara y concisa.
- Si el usuario menciona una venta o gasto, confirma que lo registrar��s y extrae los datos.
- Usa unidades bolivianas (Bs) para montos.`;

export async function sendChatMessage(userId: string, message: string, clientHistory: ChatMessage[]): Promise<string> {
  const dbHistory = await prisma.agentMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const historyMessages: OpenAI.ChatCompletionMessageParam[] = dbHistory
    .reverse()
    .map((msg: any) => ({
      role: msg.role.toLowerCase() as 'user' | 'assistant',
      content: msg.content,
    }));

  const messages: OpenAI.ChatCompletionMessageParam[] = [
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

  await prisma.agentMessage.createMany({
    data: [
      { userId, role: 'USER', content: message },
      { userId, role: 'ASSISTANT', content: reply },
    ],
  });

  return reply;
}
