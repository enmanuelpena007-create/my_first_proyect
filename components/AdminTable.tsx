type Column<T> = { key: keyof T; label: string };

export default function AdminTable<T extends Record<string, unknown>>({
  rows,
  columns,
}: {
  rows: T[];
  columns: Column<T>[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-0">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3">
                  {String(row[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
