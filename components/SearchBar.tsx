"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  return (
    <input
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value;
        setValue(nextValue);
        const params = new URLSearchParams(searchParams.toString());
        if (nextValue.trim()) params.set("q", nextValue);
        else params.delete("q");
        router.replace(`/catalogo?${params.toString()}`);
      }}
      placeholder="Buscar por nombre o SKU"
      className="w-full rounded-lg border border-black/10 px-4 py-2"
    />
  );
}
