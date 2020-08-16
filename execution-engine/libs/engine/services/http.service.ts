import { from, Observable } from "rxjs";
import { HttpRequest } from "../types";

export class HttpService {
  readonly timeoutMillis = 10000;
  /**
   * An http request without any external dependencies.
   * https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
   */
  request(
    requestInfo: HttpRequest<any>
  ): Observable<{ request: HttpRequest<any>; body: any }> {
    const data = JSON.stringify(requestInfo.body);
    requestInfo = this.attachHeaders(requestInfo, data);
    const lib =
      requestInfo.protocol === "https:" ? require("https") : require("http");
    return from(
      new Promise<{ request: HttpRequest<any>; body: any }>(
        (resolve, reject) => {
          const request = lib.request(requestInfo, (response: any) => {
            response.setEncoding("utf8");
            if (response.statusCode < 200 || response.statusCode > 299) {
              const message = "Failed to load, status code: ";
              reject(new Error(message + response.statusCode));
            }
            const body: any[] = [];
            response.on("data", (chunk: any) => body.push(chunk));
            response.on("end", () =>
              resolve({
                request: requestInfo,
                body: this.parseJsonOrString(body.join("")),
              })
            );
          });
          request.on("error", (err: any) => reject(err));
          request.setTimeout(this.timeoutMillis, () => {
            request.abort();
            reject("Request Timeout");
          });
          request.write(data);
          request.end();
        }
      )
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

  private attachHeaders(
    requestInfo: HttpRequest<any>,
    data: string
  ): HttpRequest<any> {
    return {
      ...requestInfo,
      headers: {
        "User-Agent": "jyfti/0.0.1",
        "Content-Type": "application/json",
        "Content-Length": data.length,
        ...requestInfo.headers,
      },
    };
  }
}
