import { cold } from "jest-marbles";
import { JsonExpression } from "../types/step.type";
import { VariableMap } from "../types/variable-map.type";
import { executeExpressionStep } from "./expression-step-execution";

describe("an expression step", () => {
  it("should evaluate an expression", () => {
    const expression: JsonExpression = {
      $eval: "listVar",
    };
    const variables: VariableMap = {
      listVar: ["a", "b"],
    };
    expect(executeExpressionStep(expression, variables)).toBeObservable(
      cold("(a|)", { a: ["a", "b"] })
    );
  });

  it("should return an error if the evaluation fails", () => {
    const variables: VariableMap = {
      listVar: ["a", "b"],
    };
    expect(executeExpressionStep("${listVar}", variables)).toBeObservable(
      cold("#")
    );
  });
});
