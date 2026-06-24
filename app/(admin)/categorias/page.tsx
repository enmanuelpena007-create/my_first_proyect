export const dynamic = "force-dynamic";

import AdminTable from "@/components/AdminTable";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ include: { parent: true }, orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">Categorías</h1>
      <AdminTable
        rows={categories.map((category) => ({ name: category.name, parent: category.parent?.name ?? "Raíz" }))}
        columns={[
          { key: "name", label: "Nombre" },
          { key: "parent", label: "Padre" },
        ]}
      />
    </main>
  );
}
