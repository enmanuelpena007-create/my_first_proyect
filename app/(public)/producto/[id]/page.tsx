import WhatsAppButton from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/utils";
import { getProductById } from "@/services/productService";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-500">SKU: {product.sku ?? "N/A"}</p>
      <p className="text-lg">{product.description ?? "Sin descripción"}</p>
      <p className="text-2xl font-bold text-blue-700">{formatPrice(product.price)}</p>
      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
      <WhatsAppButton product={product} />
    </main>
  );
}
