"use client"; // useRouter i useSearchParams działają tylko w komponencie klienta

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRouter, useSearchParams } from "next/navigation";
import { ComponentProps, useEffect, useRef, useState } from "react";

export function BlogFilter({
  placeholder = "Szukaj",
  ...props
}: ComponentProps<typeof Input>) {
  const router = useRouter(); // push zmienia URL bez przeładowania strony
  const searchParams = useSearchParams(); // aktualne ?query=.., kopiowane żeby zachować inne parametry
  const queryParam = "query";
  const urlQuery = searchParams.get(queryParam) ?? "";

  const [draft, setDraft] = useState(urlQuery); // wartość pola, bez opóźnienia
  const [debouncedQuery, setDebouncedQuery] = useDebouncedValue(urlQuery); // wartość do URL, po opóźnieniu
  const lastPushed = useRef<string | null>(null); // echo własnego push, ignorowane przy sync z URL

  // zmiana URL spoza filtra (link, back/forward) nadpisuje pole
  useEffect(() => {
    if (urlQuery === lastPushed.current) {
      lastPushed.current = null;
      return;
    }
    setDraft(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [urlQuery, setDebouncedQuery]);

  // urlQuery celowo pominięty: zmiana URL sama nie może wywołać push
  useEffect(() => {
    if (debouncedQuery === urlQuery) return;

    lastPushed.current = debouncedQuery;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set(queryParam, debouncedQuery);
    else params.delete(queryParam);

    router.push(`/blog?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <Input
      type="search"
      {...props}
      value={draft}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e) => {
        setDraft(e.target.value);
        setDebouncedQuery(e.target.value);
      }}
    />
  );
}
