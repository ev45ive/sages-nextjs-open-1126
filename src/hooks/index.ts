import { BlogPost } from "@/services/model";
import { useState, useEffect } from "react";

type BlogPostComment = BlogPost["comments"][number];

const fetchGET = <T>(url: string, { signal }: { signal: AbortSignal }) =>
  fetch(url, { signal }).then((res) => res.json() as Promise<T>);

export function useBlogPostCommentsQuery(
  postId = "",
  initial: BlogPostComment[] = [],
) {
  return useFetchQuery<BlogPostComment[]>(
    [postId],
    ({ signal }) => fetchGET(`/api/blog/posts/${postId}/comments`, { signal }),
    initial,
  );
}

export function useBlogPostsQuery(postId = "", initial: BlogPost[] = []) {
  return useFetchQuery<BlogPost[]>(
    [postId],
    ({ signal }) => fetchGET("/api/blog/posts", { signal }),
    initial,
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
