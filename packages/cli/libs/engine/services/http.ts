import { from, Observable } from "rxjs";
import { HttpRequest, Headers } from "../types";
import bent from "bent";
import { map, flatMap } from "rxjs/operators";

export const timeoutMillis = 10000;

export function http(
  requestInfo: HttpRequest<any>
): Observable<{ request: HttpRequest<any>; body: any }> {
  const getStream = bent(requestInfo.method);
  const headers = addDefaultHeaders(requestInfo.headers || {});
  const body = requestInfo.body
    ? Buffer.from(JSON.stringify(requestInfo.body))
    : undefined;
  return from(getStream(requestInfo.url, body, headers)).pipe(
    flatMap((stream: any) => from<string>(stream.text())),
    map((body) => parseJsonOrString(body)),
    map((body) => ({ request: requestInfo, body }))
  );
}

export function parseJsonOrString(str: string): any {
  // TODO Look at response header for content type
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function addDefaultHeaders(headers: Headers): Headers {
  return {
    "User-Agent": "jyfti/0.0.1",
    ...headers,
  };
}
