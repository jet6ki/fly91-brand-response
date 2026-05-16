/**
 * Generic API hooks.
 *
 * useApi(fn) — runs an async fetch on mount and exposes { data, loading, error, refetch }.
 * useMutation(fn) — wraps a write action; exposes { mutate, loading, error, success }.
 */

import { useEffect, useState, useCallback } from 'react';

export function useApi(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err });
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

export function useMutation(fn) {
  const [state, setState] = useState({
    loading: false,
    error: null,
    success: false,
    data: null,
  });

  const mutate = useCallback(async (args) => {
    setState({ loading: true, error: null, success: false, data: null });
    try {
      const data = await fn(args);
      setState({ loading: false, error: null, success: true, data });
      return data;
    } catch (err) {
      setState({ loading: false, error: err, success: false, data: null });
      throw err;
    }
  }, [fn]);

  return { ...state, mutate };
}
