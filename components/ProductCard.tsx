import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    sku: string | null;
    imageUrl: string | null;
  };
};

export default function ProductCard({ product }: Props) {
  return (
    <article className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 text-sm text-gray-500">SKU: {product.sku ?? "N/A"}</div>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{product.description ?? "Sin descripción"}</p>
      <p className="mt-3 text-xl font-bold text-blue-700">{formatPrice(product.price)}</p>
      <div className="mt-4 flex gap-2">
        <Link href={`/producto/${product.id}`} className="rounded bg-black px-3 py-2 text-sm text-white">
          Ver detalle
        </Link>
        <WhatsAppButton product={product} />
      </div>
    </article>
  );
}
