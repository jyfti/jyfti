import { StepExecutionService } from "./step-execution.service";
import { of } from "rxjs";
import { Step } from "../types";
import { HttpService } from "./http.service";

describe("StepExecutionService", () => {
  const httpClientStub: Partial<HttpService> = {
    request: (request) => of({ request, body: { field: "value" } }),
  };

  let service = new StepExecutionService(httpClientStub as HttpService);

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should zip steps and incompleted evaluations to a variable map", () => {
    const steps: Step[] = [
      {
        assignTo: "varA",
        expression: 1,
      },
      {
        assignTo: "varB",
        expression: 2,
      },
      {
        assignTo: "varC",
        expression: 3,
      },
    ];
    const evaluations = [1, 2];
    expect(service.toVariableMap(steps, evaluations)).toEqual({
      varA: 1,
      varB: 2,
    });
  });
});
