import AdminTable from "@/components/AdminTable";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { email: "asc" } });

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">Usuarios</h1>
      <AdminTable
        rows={users.map((user) => ({ email: user.email, role: user.role }))}
        columns={[
          { key: "email", label: "Email" },
          { key: "role", label: "Rol" },
        ]}
      />
    </main>
  );
}
