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

  const lines = items.map((item) =>
    [
      `Producto: ${item.name}`,
      `Código: ${item.sku ?? "N/A"}`,
      `Precio: ${formatPrice(item.price)}`,
      "",
      "¿Está disponible?",
    ].join("\n")
  );

  return [header, ...lines].join("\n\n");
}
