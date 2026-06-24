export const dynamic = "force-dynamic";

import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";
import { listProducts } from "@/services/productService";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [products, categories] = await Promise.all([
    listProducts(q, category),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Catálogo FerreSys Pro</h1>
      <SearchBar />
      <CategoryFilter categories={categories} selected={category} query={q} />
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
