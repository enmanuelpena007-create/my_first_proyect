import { login } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "email y password son requeridos" }, { status: 400 });
  }

  const user = await login(body.email, body.password);

  if (!user) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
