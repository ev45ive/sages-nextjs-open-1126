"use client"; // useRouter i useSearchParams działają tylko w komponencie klienta

import { useState, useEffect } from "react";


export function useDebouncedValue<T>(initialValue: T | (() => T), delay = 300) {
  const [draft, setDraft] = useState(initialValue);
  const [deboucedValue, setDeboucedValue] = useState(draft);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDeboucedValue(draft);
    }, delay);

    // Abort Timer - on deps[] change or unmount
    return () => clearTimeout(handler);
  }, [delay, draft]);

  return [deboucedValue, setDraft] as const;
}
