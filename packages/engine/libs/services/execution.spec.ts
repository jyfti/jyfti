import { cold } from "jest-marbles";

import { Workflow, ForStep, ExpressionStep } from "../types";
import { step } from "./execution";

jest.mock("./http");

describe("the execution of workflows", () => {
  describe("the execution of the next step", () => {
    it("should execute the first step", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        inputs: {},
        steps: [
          {
            assignTo: "outVar",
            expression: 1,
          } as ExpressionStep,
        ],
      };
      expect(
        step(
          workflow,
          {
            path: [0],
            inputs: {},
            evaluations: [],
          },
          {},
          ""
        )
      ).toBeObservable(cold("(a|)", { a: { path: [0], evaluation: 1 } }));
    });

    it("should execute the second step considering the evaluation of the first step without evaluating it", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        steps: [
          {
            assignTo: "var1",
            expression: 5,
          } as ExpressionStep,
          {
            assignTo: "var2",
            expression: {
              $eval: "var1",
            },
          } as ExpressionStep,
        ],
      };
      expect(
        step(
          workflow,
          {
            path: [1],
            inputs: {},
            evaluations: [42],
          },
          {},
          ""
        )
      ).toBeObservable(cold("(a|)", { a: { path: [1], evaluation: 42 } }));
    });

    describe("with a single-step loop", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        steps: [
          {
            assignTo: "outVar",
            for: {
              const: "loopVar",
              in: { $eval: "inputs.listVar" },
              do: [
                {
                  assignTo: "innerVar",
                  expression: "a",
                } as ExpressionStep,
              ],
              return: "innerVar",
            },
          } as ForStep,
        ],
      };

      it("should evaluate the return value with no loop iteration to an empty list", () => {
        expect(
          step(
            workflow,
            {
              path: [0],
              inputs: { listVar: [1] },
              evaluations: [],
            },
            {},
            ""
          )
        ).toBeObservable(cold("(a|)", { a: { path: [0], evaluation: [] } }));
      });

      it("should evaluate the return value with a single loop iteration to a single element list", () => {
        expect(
          step(
            workflow,
            {
              path: [0],
              inputs: { listVar: [1] },
              evaluations: [[["a"]]],
            },
            {},
            ""
          )
        ).toBeObservable(cold("(a|)", { a: { path: [0], evaluation: ["a"] } }));
      });

      it("should evaluate the return value with multiple loop iterations to list of the size of the iterations", () => {
        expect(
          step(
            workflow,
            {
              path: [0],
              inputs: { listVar: [1] },
              evaluations: [[["a"], ["b"], ["c"]]],
            },
            {},
            ""
          )
        ).toBeObservable(
          cold("(a|)", { a: { path: [0], evaluation: ["a", "b", "c"] } })
        );
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
              in: { $eval: "inputs.listVar" },
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
                } as ExpressionStep,
              ],
              return: "var3",
            },
          } as ForStep,
        ],
      };

      it("should evaluate the return value with no loop iteration to an empty list", () => {
        expect(
          step(
            workflow,
            {
              path: [0],
              inputs: { listVar: [1] },
              evaluations: [],
            },
            {},
            ""
          )
        ).toBeObservable(cold("(a|)", { a: { path: [0], evaluation: [] } }));
      });

      it("should evaluate the return value with a single loop iteration to a single element list", () => {
        expect(
          step(
            workflow,
            {
              path: [0],
              inputs: { listVar: [1] },
              evaluations: [[[10, 20, 30]]],
            },
            {},
            ""
          )
        ).toBeObservable(cold("(a|)", { a: { path: [0], evaluation: [30] } }));
      });

      it("should evaluate the return value with multiple loop iterations to list of the size of the iterations", () => {
        expect(
          step(
            workflow,
            {
              path: [0],
              inputs: { listVar: [1] },
              evaluations: [
                [
                  [10, 20, 30],
                  [10, 20, 30],
                  [10, 20, 30],
                ],
              ],
            },
            {},
            ""
          )
        ).toBeObservable(
          cold("(a|)", { a: { path: [0], evaluation: [30, 30, 30] } })
        );
      });
    });
  });
});
