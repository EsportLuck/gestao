import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { useEffect, useState } from "react";

export function useFetch<T = unknown>(url: string, att?: boolean) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const httpClient = new FetchHttpClient();
    httpClient.get<T>(url).then((response) => setData(response.data || null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [att]);
  return { data };
}
