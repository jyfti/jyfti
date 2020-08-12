export type HttpMethod = "POST" | "PUT" | "GET" | "DELETE" | "PATCH";

export type HttpProtocol = "https" | "http";

export interface HttpRequest<T> {
  protocol: HttpProtocol;
  hostname: string;
  path: string;
  method: HttpMethod;
  body?: T;
  port?: number;
}
