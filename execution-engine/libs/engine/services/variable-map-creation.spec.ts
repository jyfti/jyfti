import { Step } from "../types";
import { toVariableMap } from "./variable-map-creation";

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
});
