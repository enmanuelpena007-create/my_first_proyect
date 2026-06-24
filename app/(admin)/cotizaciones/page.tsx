import AdminTable from "@/components/AdminTable";
import { prisma } from "@/lib/prisma";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">Cotizaciones</h1>
      <AdminTable
        rows={quotes.map((quote) => ({
          id: quote.id,
          phone: quote.phone,
          total: quote.total ?? 0,
          createdAt: quote.createdAt.toISOString(),
        }))}
        columns={[
          { key: "id", label: "ID" },
          { key: "phone", label: "Teléfono" },
          { key: "total", label: "Total" },
          { key: "createdAt", label: "Fecha" },
        ]}
      />
    </main>
  );
}
