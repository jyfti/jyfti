import { Step, Workflow, State } from "../types";
import {
  toVariableMap,
  createVariableMapFromState,
} from "./variable-map-creation";

describe("The creation of variable maps", () => {
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
    expect(toVariableMap(steps, evaluations)).toEqual({
      varA: 1,
      varB: 2,
    });
  });

  it("should return loop variables in the variable map", () => {
    const steps: Step[] = [
      {
        assignTo: "varA",
        for: {
          const: "loopVar",
          in: { $eval: "inputs.listVar" },
          do: [
            {
              assignTo: "varB",
              expression: 1,
            },
          ],
          return: "varB",
        },
      },
    ];
    const workflow: Workflow = {
      name: "Workflow",
      steps,
    };
    const state: State = {
      path: [0, 1, 0],
      inputs: { listVar: ["a", "b"] },
      evaluations: [1, 2],
    };
    expect(createVariableMapFromState(workflow, state, {})).toHaveProperty(
      "loopVar",
      "b"
    );
  });
});
