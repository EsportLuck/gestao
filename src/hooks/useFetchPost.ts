import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import { useEffect, useState } from "react";

export function useFetchPost<T = unknown>(
  url: string,
  formData: any,
  att?: boolean,
) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const httpClient = new FetchHttpClient();
    httpClient
      .post<T>(url, formData)
      .then((response) => setData(response.data || null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [att]);
  return { data };
}
