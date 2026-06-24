import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "name es requerido" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      parentId: body.parentId,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
