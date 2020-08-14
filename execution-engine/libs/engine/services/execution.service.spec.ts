import { cold } from "jest-marbles";
import { of } from "rxjs";

import { Step, ForLoop } from "../types/step.type";
import { VariableMap } from "../types/variable-map.type";
import { ExecutionService } from "./execution.service";
import { map } from "rxjs/operators";
import { SingleStepService } from "./single-step.service";
import { HttpService } from "./http.service";

describe("ExecutionService", () => {
  const httpClientStub: Partial<HttpService> = {
    request: () => of({ body: { field: "value" } }),
  };
  let service = new ExecutionService(
    new SingleStepService(httpClientStub as HttpService)
  );

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("should execute http request step", () => {
    it("without expressions successfully", () => {
      const step: Step = {
        assignTo: "outVar",
        request: {
          method: "GET",
          url: "http://localhost:1234/abc",
        },
      };
      const variables: VariableMap = {};
      expect(service.executeStep(step, variables)).toBeObservable(
        cold("(a|)", { a: { body: { field: "value" } } })
      );
    });
  });

  describe("should evaluate expression step", () => {
    it("successfully", () => {
      const step: Step = {
        assignTo: "outVar",
        expression: {
          $eval: "inVar",
        },
      };
      const variables: VariableMap = {
        inVar: [1, 2, 3],
      };
      expect(service.executeStep(step, variables)).toBeObservable(
        cold("(a|)", { a: [1, 2, 3] })
      );
    });

    it("to an error if the expression is invalid", () => {
      const step: Step = {
        assignTo: "outVar",
        expression: {
          $eval: {
            $eval: 3,
          },
        },
      };
      const variables: VariableMap = {};
      expect(service.executeStep(step, variables)).toBeObservable(
        cold("(a|)", {
          a: {
            error: "TemplateError: $eval must be given a string expression",
          },
        })
      );
    });

    it("to an error if a variable does not exist", () => {
      const step: Step = {
        assignTo: "outVar",
        expression: {
          $eval: "inVar",
        },
      };
      const variables: VariableMap = {};
      expect(service.executeStep(step, variables)).toBeObservable(
        cold("(a|)", {
          a: {
            error: "InterpreterError: unknown context value inVar",
          },
        })
      );
    });
  });

  describe("should execute a block", () => {
    it("of no steps", () => {
      expect(service.executeBlock([], {})).toBeObservable(
        cold("(a|)", { a: [] })
      );
    });

    it("of a single step", () => {
      const step: Step = {
        assignTo: "outVar",
        expression: {
          $eval: "inVar",
        },
      };
      const variables: VariableMap = {
        inVar: [1, 2, 3],
      };
      expect(service.executeBlock([step], variables)).toBeObservable(
        cold("(a|)", { a: [[1, 2, 3]] })
      );
    });

    it("of two steps with the second step requiring the result of the first step", () => {
      const steps: Step[] = [
        {
          assignTo: "varA",
          expression: 1,
        },
        {
          assignTo: "varB",
          expression: {
            $eval: "varA + 2",
          },
        },
      ];
      expect(service.executeBlock(steps, {})).toBeObservable(
        cold("(a|)", { a: [1, 3] })
      );
    });
  });

  describe("should execute a loop", () => {
    it("with no steps and no iterations", () => {
      const forLoop: ForLoop = {
        const: "loopVar",
        in: "listVar",
        do: [],
        return: "loopVar",
      };
      expect(service.executeLoop(forLoop, { listVar: [] })).toBeObservable(
        cold("(a|)", { a: [] })
      );
    });

    it("with no steps", () => {
      const forLoop: ForLoop = {
        const: "loopVar",
        in: "listVar",
        do: [],
        return: "loopVar",
      };
      expect(
        service.executeLoop(forLoop, { listVar: [1, 2, 3] })
      ).toBeObservable(cold("(a|)", { a: [1, 2, 3] }));
    });

    it("adding a constant to each loop variable", () => {
      const forLoop: ForLoop = {
        const: "loopVar",
        in: "listVar",
        do: [
          {
            assignTo: "myVar",
            expression: {
              $eval: "loopVar + 2",
            },
          },
        ],
        return: "myVar",
      };
      expect(
        service.executeLoop(forLoop, { listVar: [1, 2, 3] })
      ).toBeObservable(cold("(a|)", { a: [3, 4, 5] }));
    });

    it("containing another loop", () => {
      const forLoop: ForLoop = {
        const: "outerLoopVar",
        in: "listVar",
        do: [
          {
            assignTo: "innerLoopVar",
            for: {
              const: "innerLoopVar",
              in: "outerLoopVar",
              do: [
                {
                  assignTo: "myVar",
                  expression: {
                    $eval: "innerLoopVar * 2",
                  },
                },
              ],
              return: "myVar",
            },
          },
        ],
        return: "innerLoopVar",
      };
      expect(
        service.executeLoop(forLoop, { listVar: [[1, 2], [3, 4, 5], [6]] })
      ).toBeObservable(cold("(a|)", { a: [[2, 4], [6, 8, 10], [12]] }));
    });
  });
});
