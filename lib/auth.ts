import { prisma } from "@/lib/prisma";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return null;
  }

  return { id: user.id, email: user.email, role: user.role };
}
