import { from, Observable } from "rxjs";
import { HttpRequest, Headers } from "../types";
import bent from "bent";
import { map, flatMap } from "rxjs/operators";

export class HttpService {
  readonly timeoutMillis = 10000;

  request(
    requestInfo: HttpRequest<any>
  ): Observable<{ request: HttpRequest<any>; body: any }> {
    const getStream = bent(requestInfo.method);
    const headers = this.addDefaultHeaders(requestInfo.headers || {});
    console.log(headers);
    const body = requestInfo.body
      ? Buffer.from(JSON.stringify(requestInfo.body))
      : undefined;
    return from(getStream(requestInfo.url, body, headers)).pipe(
      flatMap((stream: any) => from<string>(stream.text())),
      map((body) => this.parseJsonOrString(body)),
      map((body) => ({ request: requestInfo, body }))
    );
  }

  private parseJsonOrString(str: string): any {
    // TODO Look at response header for content type
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }

  private addDefaultHeaders(headers: Headers): Headers {
    return {
      "User-Agent": "jyfti/0.0.1",
      ...headers,
    };
  }
}
