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

describe("a single-step loop return evaluation step", () => {
  const step: ForStep = {
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
  };

  it("should evaluate the return value with no loop iteration to an empty list", () => {
    expect(evaluateLoopReturn([], step)).toBeObservable(
      cold("(a|)", { a: [] })
    );
  });

  it("should evaluate the return value with a single loop iteration to a single element list", () => {
    expect(evaluateLoopReturn([["a"]], step)).toBeObservable(
      cold("(a|)", { a: ["a"] })
    );
  });

  it("should evaluate the return value with multiple loop iterations to a list of the size of the iterations", () => {
    expect(evaluateLoopReturn([["a"], ["b"], ["c"]], step)).toBeObservable(
      cold("(a|)", { a: ["a", "b", "c"] })
    );
  });
});

describe("a multi-step loop return evaluation step", () => {
  const step: ForStep = {
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
  };

  it("should evaluate the return value with no loop iteration to an empty list", () => {
    expect(evaluateLoopReturn([], step)).toBeObservable(
      cold("(a|)", { a: [] })
    );
  });

  it("should evaluate the return value with a single loop iteration to a single element list", () => {
    expect(evaluateLoopReturn([[10, 20, 30]], step)).toBeObservable(
      cold("(a|)", { a: [30] })
    );
  });

  it("should evaluate the return value with multiple loop iterations to a list of the size of the iterations", () => {
    expect(
      evaluateLoopReturn(
        [
          [10, 20, 30],
          [10, 20, 30],
          [10, 20, 30],
        ],
        step
      )
    ).toBeObservable(cold("(a|)", { a: [30, 30, 30] }));
  });
});
