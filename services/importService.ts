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
  const categoryNames = [...new Set(rows.map((row) => row.categoria || row.category).filter(Boolean))];
  const categories = await prisma.category.findMany({ where: { name: { in: categoryNames } } });
  const categoryMap = new Map(categories.map((category) => [category.name, category]));

  for (const categoryName of categoryNames) {
    if (!categoryMap.has(categoryName)) {
      const createdCategory = await prisma.category.create({ data: { name: categoryName } });
      categoryMap.set(categoryName, createdCategory);
    }
  }

  const skuValues = [...new Set(rows.map((row) => row.sku).filter(Boolean))];
  const existingProducts = skuValues.length
    ? await prisma.product.findMany({ where: { sku: { in: skuValues } }, select: { sku: true } })
    : [];
  const existingSkuSet = new Set(existingProducts.map((product) => product.sku).filter(Boolean));

  const BATCH_SIZE = 50;

  for (let index = 0; index < rows.length; index += BATCH_SIZE) {
    const chunk = rows.slice(index, index + BATCH_SIZE);
    const results = await Promise.all(
      chunk.map(async (row) => {
        const name = row.nombre || row.name;
        const categoryName = row.categoria || row.category;
        if (!name || !categoryName) return { created: 0, updated: 0 };

        const category = categoryMap.get(categoryName);
        if (!category) return { created: 0, updated: 0 };

        const sku = row.sku || null;
        const data = {
          name,
          price: toNumber(row.precio || row.price),
          sku,
          categoryId: category.id,
          stock: toNumber(row.stock, 0),
        };

        if (sku) {
          await prisma.product.upsert({
            where: { sku },
            update: data,
            create: data,
          });
          return existingSkuSet.has(sku) ? { created: 0, updated: 1 } : { created: 1, updated: 0 };
        }

        await prisma.product.create({ data });
        return { created: 1, updated: 0 };
      })
    );

    for (const result of results) {
      created += result.created;
      updated += result.updated;
    }
  }

  return { created, updated, processed: rows.length };
}
