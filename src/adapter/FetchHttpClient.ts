import { unknown } from "zod";

interface HttpClient {
  get<T>(
    url: string,
  ): Promise<{ data: T | undefined; status: number; message: string }>;
  post<T>(
    url: string,
    formData: any,
    headers?: any,
    cache?: RequestCache,
  ): Promise<{ data: T | undefined; status: number; message: string }>;
  patch<T>(
    url: string,
    formData: any,
    headers?: any,
    cache?: RequestCache,
  ): Promise<{ data: T | undefined; status: number; message: string }>;
}

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, cache: RequestCache = "no-cache") {
    const response = await fetch(url, {
      cache,
    });
    if (!response.ok)
      return {
        data: undefined,
        status: response.status,
        message: response.statusText,
      };

    const data: T = await response.json();
    return { data, status: response.status, message: "Get bem sucedido" };
  }

  async post<T>(
    url: string,
    formData: any,
    headers?: any,
    cache: RequestCache = "no-cache",
  ) {
    try {
      const response = await fetch(url, {
        method: "POST",
        cache,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        return {
          data: undefined,
          status: response.status,
          message: response.statusText,
        };
      const data: T = await response.json();

      return { data, status: response.status, message: "Post bem sucedido" };
    } catch (error) {
      console.error(error);
      return { data: undefined, status: 500, message: "Erro ao postar" };
    }
  }
  async postFormData<T>(
    url: string,
    formData: FormData,
    headers: Record<string, string> = {},
    cache: RequestCache = "no-cache",
  ): Promise<{ data: T | undefined; status: number; message: string }> {
    try {
      const response = await fetch(url, {
        method: "POST",
        cache,
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return {
          data: undefined,
          status: response.status,
          message: `Erro: ${response.statusText || "Request falhou"}. Detalhes: ${errorMessage}`,
        };
      }

      const data: T = await response.json();
      return { data, status: response.status, message: "Post bem-sucedido" };
    } catch (error: any) {
      console.error(error);
      return {
        data: undefined,
        status: 500,
        message: `Erro ao postar: ${error.message || "Erro desconhecido"}`,
      };
    }
  }

  async patch<T>(
    url: string,
    formData: any,
    headers?: any,
    cache: RequestCache = "no-cache",
  ) {
    const response = await fetch(url, {
      method: "PATCH",
      cache,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok)
      return {
        data: undefined,
        status: response.status,
        message: response.statusText,
      };
    const data: T = await response.json();
    return { data, status: response.status, message: "Patch bem sucedido" };
  }
}
