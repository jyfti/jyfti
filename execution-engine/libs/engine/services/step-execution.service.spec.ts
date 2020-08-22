import { executeRequestStep } from "./step-execution.service";
import { cold } from "jest-marbles";

jest.mock("./http.service");

describe("The execution of steps", () => {
  describe("a request step", () => {
    it("should return the http response", () => {
      const request = { method: "GET", url: "abc", body: null, headers: null };
      expect(executeRequestStep(request, {})).toBeObservable(
        cold("(a|)", { a: { request, body: { field: "value" } } })
      );
    });
  });
});
