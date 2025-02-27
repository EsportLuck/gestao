import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { safeExecute } from "@/utils";
import { useEffect, useState } from "react";
import { AppError } from "@/domain/errors";

interface FetchState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
}

export function useFetch<T = unknown>(url: string, refresh?: boolean) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let isMounted = true;

    const httpClient = new FetchHttpClient();

    async function fetchData() {
      const [error, response] = await safeExecute(async () => {
        return await httpClient.get<T>(url, { signal });
      });

      if (!isMounted) return;

      setState({
        data: response?.data || null,
        error: error,
        isLoading: false,
      });
    }

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [url, refresh]);

  return state;
}
