"use client"; // useRouter i useSearchParams działają tylko w komponencie klienta

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentProps, useEffect } from "react";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";

export function BlogFilter({
  placeholder = "Szukaj",
  ...props
}: ComponentProps<typeof Input>) {
  const router = useRouter(); // push zmienia URL bez przeładowania strony
  const searchParams = useSearchParams(); // aktualne ?query=.., kopiowane żeby zachować inne parametry
  const queryParam = "query";

  const [query, setQuery] = useDebouncedValue(
    searchParams.get(queryParam) ?? "",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("query", query);
    else params.delete("query");

    router.push(`/blog?${params.toString()}`);
    // router.replace(`/blog?${params.toString()}`);
  }, [query, router, searchParams]);

  return (
    <Input
      type="search"
      defaultValue={query ?? ""}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      {...props}
    />
  );
}


