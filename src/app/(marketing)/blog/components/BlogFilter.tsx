"use client"; // useRouter i useSearchParams działają tylko w komponencie klienta

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentProps } from "react";

export function BlogFilter({
  placeholder = "Szukaj",
  ...props
}: ComponentProps<typeof Input>) {
  const router = useRouter(); // push zmienia URL bez przeładowania strony
  const searchParams = useSearchParams(); // aktualne ?query=.., kopiowane żeby zachować inne parametry

  const queryParam = "query";

  return (
    <Input
      type="search"
      defaultValue={searchParams.get(queryParam) ?? ""}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value) params.set("query", e.target.value);
        else params.delete("query");

        router.push(`/blog?${params.toString()}`);
        // router.replace(`/blog?${params.toString()}`);
      }}
      {...props}
    />
  );
}
