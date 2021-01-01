/* eslint-disable @typescript-eslint/no-var-requires */
import { cold } from "jest-marbles";
import { HttpRequestTemplate } from "../types";
import { executeRequestStep } from "./request-step-execution";

jest.mock("./http");
jest.mock("./file.service", () => ({
  writeFile: jest.fn(() => require("rxjs").of({})),
}));

describe("a request step", () => {
  it("should return the http response", () => {
    const request: HttpRequestTemplate = {
      method: "GET",
      url: "http://some.where/entity",
      body: null,
      headers: null,
      writeTo: null,
    };
    expect(executeRequestStep(request, {}, "")).toBeObservable(
      cold("(a|)", { a: { request, body: { field: "value" } } })
    );
  });

  it("should write the response to a file if writeTo is set", (done) => {
    const request: HttpRequestTemplate = {
      method: "GET",
      url: "http://some.where/entity",
      body: null,
      headers: null,
      writeTo: "file.json",
    };
    executeRequestStep(request, {}, "./out").subscribe(
      (result) => {
        expect(result).toEqual({ request, body: "Written to file.json" });
        expect(require("./file.service").writeFile).toHaveBeenCalledWith(
          "./out",
          "file.json",
          Buffer.from(JSON.stringify({ field: "value" }))
        );
      },
      fail,
      done
    );
  });
});
