import { from, Observable, defer } from "rxjs";
import { HttpRequest, Headers } from "../types";
import bent from "bent";
import { map, mergeMap, tap } from "rxjs/operators";
import { fstat } from "fs";

export const timeoutMillis = 10000;

export const acceptedStatusCodes = [
  200,
  201,
  202,
  203,
  204,
  205,
  206,
  207,
  208,
  300,
  301,
  302,
  303,
  304,
  305,
  306,
  307,
  308,
];

export function http(
  requestInfo: HttpRequest<unknown>
): Observable<{
  request: HttpRequest<unknown>;
  body: Observable<unknown>;
  statusCode: number;
  headers: Record<string, string>;
}> {
  const getStream = bent(requestInfo.method, acceptedStatusCodes);
  const headers = addDefaultHeaders(requestInfo.headers || {});
  const body = requestInfo.body
    ? Buffer.from(JSON.stringify(requestInfo.body))
    : undefined;
  return defer(() => from(getStream(requestInfo.url, body, headers))).pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map((stream: any) => ({
      request: requestInfo,
      body: from<string>(stream.text()).pipe(map(parseJsonOrString)),
      statusCode: stream.statusCode,
      headers: stream.headers,
    }))
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
