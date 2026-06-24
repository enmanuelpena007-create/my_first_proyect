import AdminTable from "@/components/AdminTable";
import { listProducts } from "@/services/productService";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">Gestión de productos</h1>
      <AdminTable
        rows={products.map((product) => ({
          name: product.name,
          sku: product.sku ?? "N/A",
          price: product.price,
          stock: product.stock,
          category: product.category.name,
        }))}
        columns={[
          { key: "name", label: "Nombre" },
          { key: "sku", label: "SKU" },
          { key: "price", label: "Precio" },
          { key: "stock", label: "Stock" },
          { key: "category", label: "Categoría" },
        ]}
      />
    </main>
  );
}
