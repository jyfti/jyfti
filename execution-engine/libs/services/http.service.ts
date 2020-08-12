export class HttpService {
  constructor() {}

  /** 
   * An http request without any external dependencies.
   * https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
   */
  get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith("https") ? require("https") : require("http");
      const request = lib.get(url, (response: any) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(
            new Error(
              "Failed to load page, status code: " + response.statusCode
            )
          );
        }
        const body: any[] = [];
        response.on("data", (chunk: any) => body.push(chunk));
        response.on("end", () => resolve(body.join("")));
      });
      request.on("error", (err: any) => reject(err));
    });
  }
}
