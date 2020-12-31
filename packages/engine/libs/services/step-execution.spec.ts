import { executeStep } from "./step-execution";
import { cold } from "jest-marbles";
import { VariableMap, ExpressionStep, ForStep } from "../types";

describe("The execution of steps", () => {
  describe("an expression step", () => {
    it("should evaluate an expression", () => {
      const step: ExpressionStep = {
        assignTo: "myVar",
        expression: {
          $eval: "listVar",
        },
      };
      const variables: VariableMap = {
        listVar: ["a", "b"],
      };
      expect(executeStep(step, [], variables)).toBeObservable(
        cold("(a|)", { a: ["a", "b"] })
      );
    });

    it("should return an error if the evaluation fails", () => {
      const step: ExpressionStep = {
        assignTo: "myVar",
        expression: "${listVar}",
      };
      const variables: VariableMap = {
        listVar: ["a", "b"],
      };
      expect(executeStep(step, [], variables)).toBeObservable(cold("#"));
    });
  });
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
        executeStep(step, [[2], [2], [2], [2], [2]], {
          listVar: ["a", "b", "c", "d", "e"],
        })
      ).toBeObservable(cold("(a|)", { a: [2, 2, 2, 2, 2] }));
    });

    it("should return an error if the local evaluations aren't an array", () => {
      expect(
        executeStep(
          step,
          { not: "an array" },
          {
            listVar: ["a", "b", "c", "d", "e"],
          }
        )
      ).toBeObservable(cold("#"));
    });
  });
});
