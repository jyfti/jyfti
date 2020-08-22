import { StepExecutionService } from "./step-execution.service";
import { cold } from "jest-marbles";

jest.mock("./http.service");

describe("StepExecutionService", () => {
  let service = new StepExecutionService();

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("the execution of a request step", () => {
    it("should return the http response", () => {
      const request = { method: "GET", url: "abc", body: null, headers: null };
      expect(service.executeRequestStep(request, {})).toBeObservable(
        cold("(a|)", { a: { request, body: { field: "value" } } })
      );
    });
  });
});
