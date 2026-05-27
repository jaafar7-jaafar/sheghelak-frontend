import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook.
 * @param {Function} fetchFn - async function that returns data
 * @param {Array} deps - dependency array (re-fetches when these change)
 * @param {boolean} immediate - whether to fetch on mount (default true)
 */
export function useApi(fetchFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result?.data ?? result);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return { data, loading, error, refetch: execute };
}

/**
 * Mutation hook — for POST/PATCH/DELETE actions (not auto-executed on mount).
 */
export function useMutation(mutateFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutateFn(...args);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutateFn]);

  return { mutate, loading, error };
}
