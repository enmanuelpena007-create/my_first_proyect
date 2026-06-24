import { deleteProduct, updateProduct } from "@/services/productService";
import { NextResponse } from "next/server";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const payload: Record<string, unknown> = {};

  if ("name" in body) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "name debe ser texto válido" }, { status: 400 });
    }
    payload.name = body.name;
  }

  if ("price" in body) {
    if (typeof body.price !== "number") {
      return NextResponse.json({ error: "price debe ser numérico" }, { status: 400 });
    }
    payload.price = body.price;
  }

  if ("categoryId" in body) {
    if (typeof body.categoryId !== "string" || !body.categoryId.trim()) {
      return NextResponse.json({ error: "categoryId debe ser texto válido" }, { status: 400 });
    }
    payload.categoryId = body.categoryId;
  }

  if ("description" in body) payload.description = body.description ?? null;
  if ("sku" in body) payload.sku = body.sku ?? null;
  if ("imageUrl" in body) payload.imageUrl = body.imageUrl ?? null;

  if ("stock" in body) {
    if (typeof body.stock !== "number") {
      return NextResponse.json({ error: "stock debe ser numérico" }, { status: 400 });
    }
    payload.stock = body.stock;
  }

  if (!Object.keys(payload).length) {
    return NextResponse.json({ error: "No hay campos válidos para actualizar" }, { status: 400 });
  }

  const product = await updateProduct(id, payload);
  return NextResponse.json(product);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await deleteProduct(id);
  return new NextResponse(null, { status: 204 });
}
