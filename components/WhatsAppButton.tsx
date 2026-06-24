import { formatPrice } from "@/lib/utils";

type ProductLike = {
  name: string;
  sku: string | null;
  price: number;
};

export default function WhatsAppButton({ product }: { product: ProductLike }) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  const message = `Hola, estoy interesado en:\n\nProducto: ${product.name}\nCódigo: ${product.sku ?? "N/A"}\nPrecio: ${formatPrice(product.price)}\n\n¿Está disponible?`;
  const href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="rounded bg-green-600 px-3 py-2 text-sm text-white">
      Cotizar por WhatsApp
    </a>
  );
}
