import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client";

const adapter = new PrismaPg ({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Carlos Mamani",
      email: "carlos@test.com",
      passwordHash: "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12",
      businessType: "restaurant",
      targetMarginPct: 40,
    },
  });

  const catIngresos = await prisma.category.create({
    data: { userId: user.id, name: "Ventas", type: "INCOME", color: "#22C55E", icon: "dollar-sign" },
  });

  const catInsumos = await prisma.category.create({
    data: { userId: user.id, name: "Insumos", type: "EXPENSE", color: "#EF4444", icon: "shopping-cart" },
  });

  const catServicios = await prisma.category.create({
    data: { userId: user.id, name: "Servicios", type: "EXPENSE", color: "#F59E0B", icon: "zap" },
  });

  const transactions = [
    { categoryId: catIngresos.id, type: "INCOME" as const, amount: 1500, note: "Venta lunes", source: "CHAT" as const },
    { categoryId: catIngresos.id, type: "INCOME" as const, amount: 2200, note: "Venta martes", source: "VOICE" as const },
    { categoryId: catIngresos.id, type: "INCOME" as const, amount: 1800, note: "Venta miercoles", source: "MANUAL" as const },
    { categoryId: catInsumos.id, type: "EXPENSE" as const, amount: 800, note: "Compra verduras", source: "CHAT" as const },
    { categoryId: catInsumos.id, type: "EXPENSE" as const, amount: 450, note: "Compra carne", source: "MANUAL" as const },
    { categoryId: catServicios.id, type: "EXPENSE" as const, amount: 200, note: "Pago luz", source: "MANUAL" as const },
    { categoryId: catServicios.id, type: "EXPENSE" as const, amount: 150, note: "Pago agua", source: "MANUAL" as const },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({
      data: { userId: user.id, ...tx },
    });
  }

  await prisma.monthlySummary.create({
    data: {
      userId: user.id,
      categoryId: catIngresos.id,
      year: 2026,
      month: 5,
      totalAmount: 5500,
      transactionCount: 3,
      avgAmount: 1833.33,
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: user.id,
      categoryId: catInsumos.id,
      title: "Reducir costo de insumos",
      description: "Buscar proveedores alternativos",
      suggestedPrice: 680,
      currentPrice: 800,
      variationPct: -15,
    },
  });

  await prisma.alert.create({
    data: {
      userId: user.id,
      message: "Tus gastos en insumos subieron un 20%",
      type: "COST_INCREASE",
    },
  });

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
