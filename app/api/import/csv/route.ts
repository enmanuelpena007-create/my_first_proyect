import { importProductsFromCSV } from "@/services/importService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const content = body.csvContent as string | undefined;

  if (!content) {
    return NextResponse.json({ error: "csvContent es requerido" }, { status: 400 });
  }

  const result = await importProductsFromCSV(content);
  return NextResponse.json(result, { status: 201 });
}
