export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [products, categories, quotes] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.quote.count(),
  ]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">Productos: {products}</div>
        <div className="rounded-lg border p-4">Categorías: {categories}</div>
        <div className="rounded-lg border p-4">Cotizaciones: {quotes}</div>
      </div>
    </main>
  );
}
