import { cold } from "jest-marbles";
import { Workflow } from "../types/workflow.type";
import { HttpService } from "./http.service";
import { of } from "rxjs";
import { ExecutionService } from "./execution.service";
import { StepExecutionService } from "./step-execution.service";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepResolvementService } from "./step-resolvement.service";
import { Engine } from "./engine";

describe("Engine", () => {
  const httpClientStub: Partial<HttpService> = {
    request: () => of({ body: { field: "value" } }),
  };
  const service = new ExecutionService(
    new StepExecutionService(httpClientStub as HttpService),
    new EvaluationResolvementService(),
    new PathAdvancementService(),
    new StepResolvementService()
  );
  const workflow: Workflow = {
    name: "MyWorkflow",
    steps: [
      {
        assignTo: "var1",
        expression: 5,
      },
      {
        assignTo: "var2",
        expression: {
          $eval: "var1 * 2",
        },
      },
      {
        assignTo: "var3",
        expression: {
          $eval: "var1 * var2",
        },
      },
    ],
  };
  const engine = new Engine(workflow, service);

  it("should be created", () => {
    expect(engine).toBeTruthy();
  });

  it("the execution of steps should progress through a small workflow and eventually terminate", () => {
    expect(engine.run()).toBeObservable(
      cold("(abc|)", {
        a: { path: [0], evaluation: 5 },
        b: { path: [1], evaluation: 10 },
        c: { path: [2], evaluation: 50 },
      })
    );
  });
});
