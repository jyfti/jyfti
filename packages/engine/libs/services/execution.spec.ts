/* eslint-disable @typescript-eslint/no-var-requires */
import { Workflow, ExpressionStep, State } from "../types";
import { checkRequire, step } from "./execution";

jest.mock("./http");
jest.mock("../step-execution/step-execution", () => ({
  executeStep: jest.fn(() => require("rxjs").of({})),
}));

describe("the execution of the next step", () => {
  it("should execute the first step", () => {
    const workflow: Workflow = {
      name: "MyWorkflow",
      inputs: {},
      steps: [
        {
          assignTo: "outVar",
          expression: 1,
        } as ExpressionStep,
      ],
    };
    const state: State = {
      path: [0],
      inputs: {},
      evaluations: [],
    };
    step(workflow, state, {}, "./out");
    const executeStep = require("../step-execution/step-execution").executeStep;
    expect(executeStep).lastCalledWith(
      workflow.steps[0],
      undefined,
      { env: {}, inputs: {} },
      "./out"
    );
  });

  it("should execute the second step considering the evaluation of the first step without evaluating it", () => {
    const workflow: Workflow = {
      name: "MyWorkflow",
      steps: [
        {
          assignTo: "var1",
          expression: 5,
        } as ExpressionStep,
        {
          assignTo: "var2",
          expression: {
            $eval: "var1",
          },
        } as ExpressionStep,
      ],
    };
    const state: State = {
      path: [1],
      inputs: {},
      evaluations: [42],
    };
    step(workflow, state, {}, "./out");
    const executeStep = require("../step-execution/step-execution").executeStep;
    expect(executeStep).lastCalledWith(
      workflow.steps[1],
      undefined,
      { env: {}, inputs: {}, var1: 42 },
      "./out"
    );
  });
});

describe("the pre-execution check of the require condition", () => {
  it("should return a require step if input is missing", () => {
    expect(
      checkRequire(
        {
          someVar: {
            type: "string",
          },
        },
        {},
        [0],
        ""
      )
    ).toEqual({
      path: [0],
      name: "",
      require: { someVar: { type: "string" } },
    });
  });

  it("should return undefined if it requires input and that input is given", () => {
    expect(
      checkRequire(
        {
          someVar: {
            type: "string",
          },
        },
        {
          someVar: "abc",
        },
        [0],
        ""
      )
    ).toEqual(undefined);
  });

  it("should return precisely the missing required inputs", () => {
    expect(
      checkRequire(
        {
          someVar1: {
            type: "string",
          },
          someVar2: {
            type: "array",
          },
        },
        {
          someVar1: "abc",
        },
        [0],
        ""
      )
    ).toEqual({
      path: [0],
      name: "",
      require: { someVar2: { type: "array" } },
    });
  });

  it("should return a step failure if an input exists but it does not satisfy the schema", () => {
    expect(
      checkRequire(
        {
          someVar1: {
            type: "string",
          },
          someVar2: {
            type: "array",
          },
        },
        {
          someVar1: "abc",
          someVar2: "def",
        },
        [0],
        ""
      )
    ).toEqual({
      name: "",
      path: [0],
      error: new Error("Required inputs are given, but wrongly typed"),
    });
  });
});
