import { AppError } from "@/domain/errors";

interface HttpResponse<T> {
  data: T;
  status: number;
}

interface HttpRequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  body?: any;
}

export class FetchHttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl = "", defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  async get<T>(
    url: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>("GET", url, options);
  }

  async post<T>(
    url: string,
    body: any,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>("POST", url, { ...options, body });
  }

  async put<T>(
    url: string,
    body: any,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>("PUT", url, { ...options, body });
  }

  async delete<T>(
    url: string,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    return this.request<T>("DELETE", url, options);
  }

  private async request<T>(
    method: string,
    url: string,
    { headers = {}, signal, body }: HttpRequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const requestUrl = `${this.baseUrl}${url}`;
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      signal, // Passa o AbortSignal para o fetch
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new AppError(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    // Para endpoints que não retornam JSON ou resposta vazia
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return { data: {} as T, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  }
}
