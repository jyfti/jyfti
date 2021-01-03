/* eslint-disable @typescript-eslint/no-var-requires */
import { executeStep } from "./step-execution";
import { ExpressionStep } from "../types";
import { of } from "rxjs";

jest.mock("./expression-step-execution", () => ({
  executeExpressionStep: jest.fn(),
}));

describe("The execution of steps", () => {
  it("should execute an expression step", (done) => {
    const expected = {};
    const executeExpressionStep = require("./expression-step-execution")
      .executeExpressionStep;
    executeExpressionStep.mockReturnValue(of(expected));
    executeStep(
      { assignTo: "myVar", expression: "" } as ExpressionStep,
      {},
      {},
      "./out"
    ).subscribe(
      () => {
        expect(executeExpressionStep).toHaveBeenCalledTimes(1);
      },
      fail,
      done
    );
  });
});
