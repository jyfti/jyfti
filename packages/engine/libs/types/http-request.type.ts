export type HttpMethod = "POST" | "PUT" | "GET" | "DELETE" | "PATCH";

export type Headers = { [header: string]: string };

export interface HttpRequest<T> {
  url: string;
  method: HttpMethod;
  body?: T;
  headers?: Headers;
  writeTo?: string;
}
