import Link from "next/link";

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  selected?: string;
  query?: string;
};

export default function CategoryFilter({ categories, selected, query }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/catalogo${query ? `?q=${encodeURIComponent(query)}` : ""}`} className="rounded border px-3 py-1 text-sm">
        Todas
      </Link>
      {categories.map((category) => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        params.set("category", category.id);
        return (
          <Link
            key={category.id}
            href={`/catalogo?${params.toString()}`}
            className={`rounded border px-3 py-1 text-sm ${selected === category.id ? "bg-black text-white" : ""}`}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
