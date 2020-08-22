import { StepExecutionService } from "./step-execution.service";
import { of } from "rxjs";
import { HttpService } from "./http.service";

describe("StepExecutionService", () => {
  const httpClientStub: Partial<HttpService> = {
    request: (request) => of({ request, body: { field: "value" } }),
  };

  let service = new StepExecutionService(httpClientStub as HttpService);

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
