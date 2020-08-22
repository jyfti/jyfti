import { cold } from "jest-marbles";

import { Workflow } from "../types";
import { nextStep } from "./execution";

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
          },
        ],
      };
      expect(
        nextStep(workflow, { path: [0], inputs: {}, evaluations: [] })
      ).toBeObservable(cold("(a|)", { a: 1 }));
    });

    it("should execute the second step considering the evaluation of the first step without evaluating it", () => {
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
              $eval: "var1",
            },
          },
        ],
      };
      expect(
        nextStep(workflow, { path: [1], inputs: {}, evaluations: [42] })
      ).toBeObservable(cold("(a|)", { a: 42 }));
    });

    describe("with a single-step loop", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        inputs: {
          listVar: [1],
        },
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
          nextStep(workflow, {
            path: [0],
            inputs: { listVar: [1] },
            evaluations: [],
          })
        ).toBeObservable(cold("(a|)", { a: [] }));
      });

      it("should evaluate the return value with a single loop iteration to a single element list", () => {
        expect(
          nextStep(workflow, {
            path: [0],
            inputs: { listVar: [1] },
            evaluations: [[["a"]]],
          })
        ).toBeObservable(cold("(a|)", { a: ["a"] }));
      });

      it("should evaluate the return value with multiple loop iterations to list of the size of the iterations", () => {
        expect(
          nextStep(workflow, {
            path: [0],
            inputs: { listVar: [1] },
            evaluations: [[["a"], ["b"], ["c"]]],
          })
        ).toBeObservable(cold("(a|)", { a: ["a", "b", "c"] }));
      });
    });

    describe("with a multi-step loop", () => {
      const workflow: Workflow = {
        name: "MyWorkflow",
        inputs: { listVar: [1] },
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
          nextStep(workflow, {
            path: [0],
            inputs: { listVar: [1] },
            evaluations: [],
          })
        ).toBeObservable(cold("(a|)", { a: [] }));
      });

      it("should evaluate the return value with a single loop iteration to a single element list", () => {
        expect(
          nextStep(workflow, {
            path: [0],
            inputs: { listVar: [1] },
            evaluations: [[[10, 20, 30]]],
          })
        ).toBeObservable(cold("(a|)", { a: [30] }));
      });

      it("should evaluate the return value with multiple loop iterations to list of the size of the iterations", () => {
        expect(
          nextStep(workflow, {
            path: [0],
            inputs: { listVar: [1] },
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
