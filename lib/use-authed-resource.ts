"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Fetches API resources on the client so requests carry the caller's Bearer
 * token (server components cannot read localStorage). Call `reload()` to
 * refetch after a mutation.
 */
export function useAuthedResource<T>(
  fetcher: () => Promise<T>,
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, error, loading, reload };
}
