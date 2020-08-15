import { cold } from "jest-marbles";
import { of } from "rxjs";

import { ExecutionEngine } from "./execution-engine.service";
import { Workflow } from "../types/workflow.type";
import { SingleStepService } from "./single-step.service";
import { HttpService } from "./http.service";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepResolvementService } from "./step-resolvement.service";

describe("ExecutionEngineService", () => {
  const httpClientStub: Partial<HttpService> = {
    request: () => of({ body: { field: "value" } }),
  };
  let service = new ExecutionEngine(
    new SingleStepService(httpClientStub as HttpService),
    new EvaluationResolvementService(),
    new PathAdvancementService(),
    new StepResolvementService()
  );

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("the execution of steps", () => {
    it("should progress through a small workflow and eventually terminate", () => {
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
      expect(service.run(workflow)).toBeObservable(
        cold("(abc|)", {
          a: { path: [0], evaluation: 5 },
          b: { path: [1], evaluation: 10 },
          c: { path: [2], evaluation: 50 },
        })
      );
    });
  });

  describe("the execution of the next step", () => {
    it("should execute the first step", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        steps: [
          {
            assignTo: "outVar",
            expression: 1,
          },
        ],
      };
      expect(
        service.nextStep(workflow, { path: [0], evaluations: [] })
      ).toBeObservable(cold("(a|)", { a: 1 }));
    });

    it("should execute the second step considering the evaluation of the first step without evaluating it", () => {
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
              $eval: "var1",
            },
          },
        ],
      };
      expect(
        service.nextStep(workflow, { path: [1], evaluations: [42] })
      ).toBeObservable(cold("(a|)", { a: 42 }));
    });

    describe("with a single-step loop", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        steps: [
          {
            assignTo: "outVar",
            for: {
              const: "loopVar",
              in: "listVar",
              do: [
                {
                  assignTo: "innerVar",
                  expression: "a",
                },
              ],
              return: "innerVar",
            },
          },
        ],
      };

      it("should evaluate the return value with no loop iteration to an empty list", () => {
        expect(
          service.nextStep(workflow, { path: [0], evaluations: [] })
        ).toBeObservable(cold("(a|)", { a: [] }));
      });

      it("should evaluate the return value with a single loop iteration to a single element list", () => {
        expect(
          service.nextStep(workflow, { path: [0], evaluations: [[["a"]]] })
        ).toBeObservable(cold("(a|)", { a: ["a"] }));
      });

      it("should evaluate the return value with multiple loop iterations to list of the size of the iterations", () => {
        expect(
          service.nextStep(workflow, {
            path: [0],
            evaluations: [[["a"], ["b"], ["c"]]],
          })
        ).toBeObservable(cold("(a|)", { a: ["a", "b", "c"] }));
      });
    });

    describe("with a multi-step loop", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        steps: [
          {
            assignTo: "outVar",
            for: {
              const: "loopVar",
              in: "listVar",
              do: [
                {
                  assignTo: "var1",
                  expression: 10,
                },
                {
                  assignTo: "var2",
                  expression: 20,
                },
                {
                  assignTo: "var3",
                  expression: {
                    $eval: "var1 + var2",
                  },
                },
              ],
              return: "var3",
            },
          },
        ],
      };

      it("should evaluate the return value with no loop iteration to an empty list", () => {
        expect(
          service.nextStep(workflow, { path: [0], evaluations: [] })
        ).toBeObservable(cold("(a|)", { a: [] }));
      });

      it("should evaluate the return value with a single loop iteration to a single element list", () => {
        expect(
          service.nextStep(workflow, {
            path: [0],
            evaluations: [[[10, 20, 30]]],
          })
        ).toBeObservable(cold("(a|)", { a: [30] }));
      });

      it("should evaluate the return value with multiple loop iterations to list of the size of the iterations", () => {
        expect(
          service.nextStep(workflow, {
            path: [0],
            evaluations: [
              [
                [10, 20, 30],
                [10, 20, 30],
                [10, 20, 30],
              ],
            ],
          })
        ).toBeObservable(cold("(a|)", { a: [30, 30, 30] }));
      });
    });
  });
});
