import { deleteProduct, updateProduct } from "@/services/productService";
import { NextResponse } from "next/server";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const product = await updateProduct(id, body);
  return NextResponse.json(product);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await deleteProduct(id);
  return new NextResponse(null, { status: 204 });
}
