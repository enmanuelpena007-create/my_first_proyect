import { prisma } from "@/lib/prisma";
import { scryptSync, timingSafeEqual } from "node:crypto";

function verifyPassword(input: string, stored: string) {
  if (stored.startsWith("scrypt:")) {
    const parts = stored.split(":");
    if (parts.length !== 3) return false;
    const [algorithm, salt, hash] = parts;
    if (algorithm !== "scrypt") return false;
    if (!salt || !hash) return false;
    const hashedInput = scryptSync(input, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(hashedInput), Buffer.from(hash));
  }

  return input === stored;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.password)) {
    return null;
  }

  return { id: user.id, email: user.email, role: user.role };
}
