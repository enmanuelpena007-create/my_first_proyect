import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      parentId: body.parentId,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
