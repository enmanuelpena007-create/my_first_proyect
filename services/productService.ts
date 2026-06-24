import { prisma } from "@/lib/prisma";

type ProductInput = {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  imageUrl?: string;
  stock?: number;
  categoryId: string;
};

export async function listProducts(search?: string, categoryId?: string) {
  return prisma.product.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, include: { category: true } });
}

export async function createProduct(data: ProductInput) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}
