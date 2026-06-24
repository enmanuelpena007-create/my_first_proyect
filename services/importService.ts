import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";

function parseCSV(content: string) {
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const [headers, ...rows] = lines;
  const keys = headers.split(",").map((key) => key.trim().toLowerCase());

  return rows.map((row) => {
    const values = row.split(",").map((value) => value.trim());
    return keys.reduce<Record<string, string>>((acc, key, index) => {
      acc[key] = values[index] ?? "";
      return acc;
    }, {});
  });
}

export async function importProductsFromCSV(content: string) {
  const rows = parseCSV(content);
  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const name = row.nombre || row.name;
    const categoryName = row.categoria || row.category;
    if (!name || !categoryName) continue;

    let category = await prisma.category.findFirst({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryName } });
    }

    const sku = row.sku || null;
    const data = {
      name,
      price: toNumber(row.precio || row.price),
      sku,
      categoryId: category.id,
      stock: toNumber(row.stock, 0),
    };

    if (sku) {
      const previous = await prisma.product.findUnique({ where: { sku } });
      await prisma.product.upsert({
        where: { sku },
        update: data,
        create: data,
      });
      if (previous) updated += 1;
      else created += 1;
    } else {
      await prisma.product.create({ data });
      created += 1;
    }
  }

  return { created, updated, processed: rows.length };
}
