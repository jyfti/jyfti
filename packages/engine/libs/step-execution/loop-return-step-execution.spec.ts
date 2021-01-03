import { cold } from "jest-marbles";
import { ExpressionStep, ForStep } from "../types/step.type";
import { evaluateLoopReturn } from "./loop-return-step-execution";

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
    expect(evaluateLoopReturn([[2], [2], [2], [2], [2]], step)).toBeObservable(
      cold("(a|)", { a: [2, 2, 2, 2, 2] })
    );
  });

  it("should return an error if the local evaluations aren't an array", () => {
    expect(evaluateLoopReturn({ not: "an array" }, step)).toBeObservable(
      cold("#")
    );
  });
});
