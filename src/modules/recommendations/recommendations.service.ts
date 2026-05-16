import Queue from 'bull';
import OpenAI from 'openai';
import { prisma } from '../../shared/config/prisma';
import { getIO } from '../../shared/config/socket';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Cola de Bull ─────────────────────────────────────────────────────────────
export const recommendationQueue = new Queue('recommendations', {
  redis: process.env.REDIS_URL ?? 'redis://localhost:6379',
});

export interface RecommendationJobData {
  userId: string;
  categoryId: string;
  categoryName: string;
  currentMonthTotal: number;
  previousAvg: number;
  variationPct: number;
}

// ─── Procesador del job ───────────────────────────────────────────────────────
recommendationQueue.process(async (job) => {
  const data: RecommendationJobData = job.data;

  // Obtener margen objetivo del usuario
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { targetMarginPct: true, businessType: true },
  });

  if (!user) return;

  const targetMargin = user.targetMarginPct ?? 40;

  // Precio sugerido = Costo Real / (1 - Margen Objetivo)
  const suggestedPrice = data.currentMonthTotal / (1 - targetMargin / 100);

  // GPT-4o genera el razonamiento
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Eres un consultor financiero para micro-emprendedores bolivianos.
Genera una recomendación concreta de ajuste de precio.
Responde ÚNICAMENTE en JSON válido sin markdown:
{"suggestedPrice": number, "reasoning": "max 2 oraciones", "urgency": "LOW"|"MEDIUM"|"HIGH"}`,
      },
      {
        role: 'user',
        content: `Negocio: ${user.businessType}.
Categoría: ${data.categoryName}.
Gasto promedio anterior: ${data.previousAvg.toFixed(2)} Bs.
Gasto actual: ${data.currentMonthTotal.toFixed(2)} Bs.
Variación: +${data.variationPct.toFixed(1)}%.
Margen objetivo: ${targetMargin}%.
¿Cuál debería ser el nuevo precio de venta?`,
      },
    ],
    temperature: 0,
    max_tokens: 200,
  });

  let aiData = { suggestedPrice, reasoning: 'Precio calculado por fórmula de margen.', urgency: 'MEDIUM' };
  try {
    const raw = aiResponse.choices[0].message.content ?? '{}';
    aiData = JSON.parse(raw);
  } catch {
    // Usar defaults si GPT falla
  }

  // Guardar recomendación en BD
  const recommendation = await prisma.recommendation.create({
    data: {
      userId: data.userId,
      categoryId: data.categoryId,
      title: `Ajuste de precio — ${data.categoryName}`,
      description: aiData.reasoning,
      suggestedPrice: aiData.suggestedPrice,
      currentPrice: data.previousAvg,
      variationPct: data.variationPct,
      status: 'ACTIVE',
    },
  });

  // Emitir evento por Socket.io al usuario
  try {
    const io = getIO();
    io.to(`user:${data.userId}`).emit('new_recommendation', { recommendation });
  } catch {
    console.warn('Socket.io no disponible para emitir evento.');
  }

  return recommendation;
});

// ─── Función para encolar un job ──────────────────────────────────────────────
export async function enqueueRecommendationJob(data: RecommendationJobData) {
  await recommendationQueue.add(data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
  });
}

// ─── Análisis de desviación al crear gasto ────────────────────────────────────
/**
 * Llamar después de crear una transacción de tipo EXPENSE.
 * Si la desviación vs promedio 3 meses > 15%, encola job de recomendación.
 */
export async function analyzeExpenseDeviation(
  userId: string,
  categoryId: string,
  amount: number
) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Calcular total del mes actual para esta categoría
  const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  const currentTotal = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      categoryId,
      type: 'EXPENSE',
      date: { gte: currentMonthStart, lte: currentMonthEnd },
    },
  });

  const currentMonthTotal = Number(currentTotal._sum.amount ?? 0);

  // Calcular promedio de los últimos 3 meses
  const threeMonthsAgo = new Date(currentYear, currentMonth - 4, 1);
  const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59);

  const previousTotals = await prisma.transaction.groupBy({
    by: ['date'],
    _sum: { amount: true },
    where: {
      userId,
      categoryId,
      type: 'EXPENSE',
      date: { gte: threeMonthsAgo, lte: lastMonthEnd },
    },
  });

  if (previousTotals.length === 0) return; // Sin historial previo

  const previousAvg = previousTotals.reduce((sum, t) => sum + Number(t._sum.amount ?? 0), 0) / 3;

  if (previousAvg === 0) return;

  const variationPct = ((currentMonthTotal - previousAvg) / previousAvg) * 100;

  // Umbral: 15%
  if (variationPct > 15) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return;

    await enqueueRecommendationJob({
      userId,
      categoryId,
      categoryName: category.name,
      currentMonthTotal,
      previousAvg,
      variationPct,
    });
  }
}

// ─── CRUD de recomendaciones ──────────────────────────────────────────────────
export async function getActiveRecommendations(userId: string) {
  return prisma.recommendation.findMany({
    where: { userId, status: 'ACTIVE' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateRecommendationStatus(
  id: string,
  userId: string,
  status: 'APPLIED' | 'DISMISSED'
) {
  return prisma.recommendation.update({
    where: { id, userId },
    data: { status },
  });
}
