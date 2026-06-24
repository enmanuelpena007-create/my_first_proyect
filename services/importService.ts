import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";
import { parse } from "csv-parse/sync";

function parseCSV(content: string) {
  return parse(content, {
    columns: (headers: string[]) => headers.map((header) => header.trim().toLowerCase()),
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];
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
          const updateResult = await prisma.product.updateMany({
            where: { sku },
            data,
          });

          if (updateResult.count > 0) {
            return { created: 0, updated: 1 };
          }

          try {
            await prisma.product.create({ data });
            return { created: 1, updated: 0 };
          } catch {
            await prisma.product.update({
              where: { sku },
              data,
            });
            return { created: 0, updated: 1 };
          }
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
