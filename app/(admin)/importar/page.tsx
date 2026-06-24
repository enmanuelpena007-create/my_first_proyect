export default function AdminImportPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-3 p-6">
      <h1 className="text-3xl font-bold">Importar CSV</h1>
      <p>Usa el endpoint POST /api/import/csv para subir el contenido CSV y ejecutar inserción/actualización masiva por SKU.</p>
      <p>También puedes exportar el catálogo completo desde GET /api/products en formato JSON.</p>
    </main>
  );
}
