import { cold } from "jest-marbles";
import { ExpressionStep, ForStep } from "../types/step.type";
import { executeStep } from "./step-execution";

describe("a loop return evaluation step", () => {
  const step: ForStep = {
    assignTo: "myVar",
    for: {
      const: "loopVar",
      in: {
        $eval: "listVar",
      },
      do: [
        {
          assignTo: "innerVar",
          expression: 2,
        } as ExpressionStep,
      ],
      return: "innerVar",
    },
  };

  it("should return the collection of all inner variable values of the return variable", () => {
    expect(
      executeStep(
        step,
        [[2], [2], [2], [2], [2]],
        {
          listVar: ["a", "b", "c", "d", "e"],
        },
        ""
      )
    ).toBeObservable(cold("(a|)", { a: [2, 2, 2, 2, 2] }));
  });

  it("should return an error if the local evaluations aren't an array", () => {
    expect(
      executeStep(
        step,
        { not: "an array" },
        {
          listVar: ["a", "b", "c", "d", "e"],
        },
        ""
      )
    ).toBeObservable(cold("#"));
  });
});
