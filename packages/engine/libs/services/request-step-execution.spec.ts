import { cold } from "jest-marbles";
import { RequestStep } from "../types";
import { executeStep } from "./step-execution";

jest.mock("./http");

describe("a request step", () => {
  it("should return the http response", () => {
    const step: RequestStep = {
      assignTo: "myVar",
      request: {
        method: "GET",
        url: "abc",
        body: null,
        headers: null,
        writeTo: null,
      },
    };
    expect(executeStep(step, [], {}, "")).toBeObservable(
      cold("(a|)", { a: { request: step.request, body: { field: "value" } } })
    );
  });
});
