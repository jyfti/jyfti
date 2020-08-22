import { cold } from "jest-marbles";
import { HttpService } from "./http.service";
import { of } from "rxjs";
import { ExecutionService } from "./execution.service";
import { StepExecutionService } from "./step-execution.service";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepResolvementService } from "./step-resolvement.service";
import { Engine } from "./engine";
import { Workflow } from "../types";

describe("Engine", () => {
  const httpClientStub: Partial<HttpService> = {
    request: (request) => of({ request, body: { field: "value" } }),
  };
  const service = new ExecutionService(
    new StepExecutionService(httpClientStub as HttpService),
    new EvaluationResolvementService(),
    new PathAdvancementService(),
    new StepResolvementService()
  );
  const workflow: Workflow = {
    name: "MyWorkflow",
    inputs: {},
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
      {
        assignTo: "var4",
        expression: [1, 2, 3, 4]
      },
      {
        assignTo: "var5",
        for: {
          const: "loopVar",
          in: "var4",
          do: [
            {
              assignTo: "var6",
              expression: "${loopVar * 2}"
            }
          ],
          return: "var6"
        }
      }
    ],
  };
  const engine = new Engine(workflow, service);

  it("should be created", () => {
    expect(engine).toBeTruthy();
  });

  it("the execution of steps should progress through a small workflow and eventually terminate", () => {
    expect(engine.complete(engine.init({}))).toBeObservable(
      cold("(abcdefghi|)", {
        a: { path: [0], evaluation: 5 },
        b: { path: [1], evaluation: 10 },
        c: { path: [2], evaluation: 50 },
        d: { path: [3], evaluation: [1, 2, 3, 4] },
        e: { path: [4, 0, 0], evaluation: 2 },
        f: { path: [4, 1, 0], evaluation: 4 },
        g: { path: [4, 2, 0], evaluation: 6 },
        h: { path: [4, 3, 0], evaluation: 8 },
        i: { path: [4], evaluation: [2, 4, 6, 8] },
      })
    );
  });
});
