import { cold } from "jest-marbles";
import { Engine } from "./engine";
import { Workflow, ExpressionStep, ForStep, State, StepResult } from "../types";
import { of, Observable } from "rxjs";

jest.mock("./http");

describe("Engine", () => {
  it("the execution of steps should progress through a small workflow and eventually terminate", () => {
    const workflow: Workflow = {
      name: "MyWorkflow",
      inputs: {},
      steps: [
        {
          assignTo: "var1",
          expression: 5,
        } as ExpressionStep,
        {
          assignTo: "var2",
          expression: {
            $eval: "var1 * 2",
          },
        } as ExpressionStep,
        {
          assignTo: "var3",
          expression: {
            $eval: "var1 * var2",
          },
        } as ExpressionStep,
        {
          assignTo: "var4",
          expression: [1, 2, 3, 4],
        } as ExpressionStep,
        {
          assignTo: "var5",
          for: {
            const: "loopVar",
            in: { $eval: "var4" },
            do: [
              {
                assignTo: "var6",
                expression: {
                  $eval: "loopVar * 2",
                },
              } as ExpressionStep,
            ],
            return: "var6",
          },
        } as ForStep,
      ],
    };
    const engine = new Engine(workflow, {});
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

  it("a sequence of step results should be transformed to a sequence of states", () => {
    const state: State = {
      path: [0],
      evaluations: [],
      inputs: {
        myListVar: [42],
      },
    };
    const workflow: Workflow = {
      name: "Workflow",
      steps: [
        {
          assignTo: "myVar1",
          expression: "a",
        } as ExpressionStep,
        {
          assignTo: "myVar2",
          expression: "b",
        } as ExpressionStep,
        {
          assignTo: "myVar3",
          for: {
            const: "myLoopVar",
            in: {
              $eval: "inputs.myListVar",
            },
            do: [
              {
                assignTo: "myVar31",
                expression: "c",
              } as ExpressionStep,
              {
                assignTo: "myVar32",
                expression: "d",
              } as ExpressionStep,
            ],
            return: "myVar31",
          },
        } as ForStep,
      ],
    };
    const engine = new Engine(workflow, {});
    const stepResult$: Observable<StepResult> = of(
      {
        path: [0],
        evaluation: "a",
      },
      {
        path: [1],
        evaluation: "b",
      },
      {
        path: [2, 0, 0],
        evaluation: "c",
      },
      {
        path: [2, 0, 1],
        evaluation: "d",
      },
      {
        path: [2],
        evaluation: ["c"],
      }
    );
    expect(stepResult$.pipe(engine.transitionFrom(state))).toBeObservable(
      cold("(abcde|)", {
        a: {
          evaluations: ["a"],
          inputs: state.inputs,
          path: [1],
        },
        b: {
          evaluations: ["a", "b"],
          inputs: state.inputs,
          path: [2, 0, 0],
        },
        c: {
          evaluations: ["a", "b", [["c"]]],
          inputs: state.inputs,
          path: [2, 0, 1],
        },
        d: {
          evaluations: ["a", "b", [["c", "d"]]],
          inputs: state.inputs,
          path: [2],
        },
        e: {
          evaluations: ["a", "b", ["c"]],
          inputs: state.inputs,
          path: [],
        },
      })
    );
  });
});
