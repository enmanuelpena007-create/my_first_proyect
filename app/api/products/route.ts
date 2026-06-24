import { createProduct, listProducts } from "@/services/productService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const products = await listProducts(q, category);
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (
    typeof body.name !== "string" ||
    typeof body.categoryId !== "string" ||
    typeof body.price !== "number"
  ) {
    return NextResponse.json(
      { error: "name, price y categoryId son requeridos y deben tener tipo válido" },
      { status: 400 }
    );
  }

  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
