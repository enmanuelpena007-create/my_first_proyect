import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

type QuoteItem = {
  name: string;
  sku?: string | null;
  price: number;
  quantity?: number;
};

export async function createQuote(phone: string, items: QuoteItem[]) {
  const total = items.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);
  return prisma.quote.create({ data: { phone, items, total } });
}

export function buildWhatsAppMessage(items: QuoteItem[]) {
  const header = "Hola, estoy interesado en:";

  const lines = items.map(
    (item) =>
      `\nProducto: ${item.name}\nCódigo: ${item.sku ?? "N/A"}\nPrecio: ${formatPrice(item.price)}\n\n¿Está disponible?`
  );

  return [header, ...lines].join("\n\n");
}
