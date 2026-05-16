import OpenAI from 'openai';
import { Readable } from 'stream';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TransactionEntity {
  tipo: 'venta' | 'gasto' | null;
  producto: string | null;
  cantidad: number | null;
  monto: number | null;
  nota: string | null;
}

/**
 * Envía el audio a Whisper API y devuelve el texto transcrito.
 */
export async function transcribeAudio(
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  // Convertir buffer a File-like object para el SDK de OpenAI
  const audioFile = new File([buffer], 'audio.webm', { type: mimetype });

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: audioFile,
    language: 'es',
  });

  return response.text;
}

/**
 * Usa GPT-4o para extraer la entidad de transacción del texto transcrito.
 * Devuelve: { tipo, producto, cantidad, monto, nota }
 */
export async function extractTransactionEntity(
  text: string
): Promise<TransactionEntity> {
  const systemPrompt = `Eres un extractor de datos financieros para micro-emprendedores bolivianos.
Dado un texto en español, extrae la información de una transacción y responde ÚNICAMENTE en JSON válido.
Sin texto adicional, sin markdown, solo JSON puro.

Esquema de respuesta:
{
  "tipo": "venta" | "gasto" | null,
  "producto": "nombre del producto o insumo" | null,
  "cantidad": número entero | null,
  "monto": número decimal total en bolivianos | null,
  "nota": "texto libre adicional" | null
}

Ejemplos:
- "Vendí 3 platos de pollo a 35 bolivianos" → {"tipo":"venta","producto":"pollo","cantidad":3,"monto":105,"nota":null}
- "Gasté 200 bolivianos en carne para la semana" → {"tipo":"gasto","producto":"carne","cantidad":null,"monto":200,"nota":"para la semana"}
- "Compré 5 kilos de papa a 8 bolivianos el kilo" → {"tipo":"gasto","producto":"papa","cantidad":5,"monto":40,"nota":null}`;

  const response = await openai.chat.completions.create({
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
    // Si GPT devuelve algo inesperado, retornamos entidad vacía
    return { tipo: null, producto: null, cantidad: null, monto: null, nota: raw };
  }
}
