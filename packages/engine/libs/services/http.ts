import { from, Observable, defer } from "rxjs";
import { HttpRequest, Headers } from "../types";
import bent from "bent";
import { map, flatMap } from "rxjs/operators";

export const timeoutMillis = 10000;

export function http(
  requestInfo: HttpRequest<unknown>
): Observable<{ request: HttpRequest<unknown>; body: unknown }> {
  const getStream = bent(requestInfo.method);
  const headers = addDefaultHeaders(requestInfo.headers || {});
  const body = requestInfo.body
    ? Buffer.from(JSON.stringify(requestInfo.body))
    : undefined;
  return defer(() => from(getStream(requestInfo.url, body, headers))).pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flatMap((stream: any) => from<string>(stream.text())),
    map((body) => parseJsonOrString(body)),
    map((body) => ({ request: requestInfo, body }))
  );
}

function parseJsonOrString(str: string): unknown {
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
