"use client";

import { useEffect, useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "Polubiono" : "Polub"}
    </button>
  );
}

export function useFetchQuery<T>(
  queryKey: unknown[],
  fetcher: (init: { signal: AbortSignal }) => Promise<T>,
  initial?: T,
) {
  const [data, setData] = useState<T | undefined>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const [refetchKey, setRefetchKey] = useState(() => Date.now());
  const refetch = () => setRefetchKey(Date.now());

  useEffect(() => {
    const huston = new AbortController();

    const handler = setTimeout(() => {
      setIsLoading(true);

      fetcher({
        signal: huston.signal,
      })
        .then((e) => setData(e))
        .catch((e) => setError(e))
        .finally(() => setIsLoading(false));
    }, 0);

    return () => {
      clearTimeout(handler);
      huston.abort("CANCELLED");
    };
  }, [...queryKey, refetchKey]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
