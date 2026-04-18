// 通用请求工具

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  timeout?: number;
}

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public url: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function request<T>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, timeout = 30000 } = options;
  const url = `${baseUrl}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        response.status,
        `API request failed: ${response.status} ${response.statusText}`,
        url
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new APIError(0, `Request timeout after ${timeout}ms`, url);
      }
      throw new APIError(0, error.message, url);
    }

    throw new APIError(0, 'Unknown error', url);
  }
}