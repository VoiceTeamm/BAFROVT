import OpenAI from 'openai';
import { Readable } from 'stream';

export interface TransactionEntity {
  tipo: 'venta' | 'gasto' | null;
  producto: string | null;
  cantidad: number | null;
  monto: number | null;
  nota: string | null;
}

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function transcribeAudio(buffer: Buffer, mimetype: string): Promise<string> {
  const audioFile = new File([buffer], 'audio.webm', { type: mimetype });
  const response = await getOpenAI().audio.transcriptions.create({
    model: 'whisper-1',
    file: audioFile,
    language: 'es',
  });
  return response.text;
}

export async function extractTransactionEntity(text: string): Promise<TransactionEntity> {
  const systemPrompt = `Eres un extractor de datos financieros para micro-emprendedores bolivianos.
Dado un texto en espa?ol, extrae la informaci¨®n de una transacci¨®n y responde ¨²NICAMENTE en JSON v¨¢lido.
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
    return JSON.parse(raw) as TransactionEntity;
  } catch {
    return { tipo: null, producto: null, cantidad: null, monto: null, nota: raw };
  }
}
