import { cold } from "jest-marbles";
import { ExpressionStep } from "../types/step.type";
import { VariableMap } from "../types/variable-map.type";
import { executeStep } from "./step-execution";

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
    expect(executeStep(step, [], variables, "")).toBeObservable(
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
    expect(executeStep(step, [], variables, "")).toBeObservable(cold("#"));
  });
});
