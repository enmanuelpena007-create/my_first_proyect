import { buildWhatsAppMessage, createQuote } from "@/services/quoteService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (typeof body.phone !== "string" || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "phone e items son requeridos" }, { status: 400 });
  }

  const quote = await createQuote(body.phone, body.items ?? []);
  const message = buildWhatsAppMessage(body.items ?? []);
  return NextResponse.json({ quote, whatsappMessage: message }, { status: 201 });
}
