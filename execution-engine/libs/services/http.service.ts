import { from, Observable } from "rxjs";
import { HttpRequest } from "../types/http-request.type";

export class HttpService {
    
  /**
   * An http request without any external dependencies.
   * https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
   */
  request(requestInfo: HttpRequest<any>): Observable<any> {
    return from(
      new Promise<string>((resolve, reject) => {
        const lib = requestInfo.protocol.startsWith("https")
          ? require("https")
          : require("http");
        const request = lib.request(requestInfo, (response: any) => {
          if (response.statusCode < 200 || response.statusCode > 299) {
            reject(
              new Error(
                "Failed to load page, status code: " + response.statusCode
              )
            );
          }
          const body: any[] = [];
          response.on("data", (chunk: any) => body.push(chunk));
          response.on("end", () => resolve(JSON.parse(body.join(""))));
        });
        request.on("error", (err: any) => reject(err));
      })
    );
  }
}
