import { buildWhatsAppMessage, createQuote } from "@/services/quoteService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const quote = await createQuote(body.phone, body.items ?? []);
  const message = buildWhatsAppMessage(body.items ?? []);
  return NextResponse.json({ quote, whatsappMessage: message }, { status: 201 });
}
