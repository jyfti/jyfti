/* eslint-disable @typescript-eslint/no-explicit-any */
import { execute } from "./execute.command";
import { printJson, printStepResult } from "../../print.service";
import { Workflow } from "@jyfti/engine";
import { of } from "rxjs";
import logSymbols from "log-symbols";

jest.mock("../../data-access/workflow.dao", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/schema.dao", () => ({
  readWorkflowSchemaOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../data-access/state.dao", () => ({
  readStateOrTerminate: () =>
    Promise.resolve({
      path: [0],
      inputs: {},
      evaluations: [],
    }),
  writeState: jest.fn(() => Promise.resolve()),
}));
jest.mock("../../data-access/environment.dao", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../validator", () => ({
  validateInputsOrTerminate: () => Promise.resolve(),
  validateWorkflowOrTerminate: () => Promise.resolve(),
  validateEnvironmentOrTerminate: () => Promise.resolve(),
}));
jest.mock("../../inquirer.service", () => ({
  promptWorkflow: () => Promise.resolve("my-workflow"),
  promptWorkflowInputs: (workflow: Workflow) =>
    Promise.resolve(
      Object.keys(workflow.inputs || {}).map((_in, i) => "my-input-" + i)
    ),
}));
jest.mock("@jyfti/engine", () => {
  const engine = {
    init: jest.fn(() => ({})),
    complete: jest.fn(() => require("rxjs").empty()),
    transitionFrom: jest.fn(() => (stepResult$) =>
      stepResult$.pipe(require("rxjs/operators").map(() => ({})))
    ),
    getOutput: jest.fn(() => ({})),
    resolveStep: () => ({}),
  };
  return {
    engine,
    createEngine: () => engine,
    isSuccess: jest.requireActual("@jyfti/engine").isSuccess,
    isFailure: jest.requireActual("@jyfti/engine").isFailure,
  };
});

describe("the execute command", () => {
  const stepResult = { path: [], evaluation: "a" };
  const output = { myOutput: "output" };

  let logSpy: any;
  let errorSpy: any;
  let writeStateSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeStateSpy = require("../../data-access/state.dao").writeState;
  });

  it("should run of a workflow with no inputs to completion", async () => {
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    require("@jyfti/engine").engine.getOutput.mockReturnValue(output);
    await execute("my-workflow");
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      logSymbols.success + " Initialized"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      printStepResult({ path: [], evaluation: null })
    );
    expect(logSpy).toHaveBeenNthCalledWith(3, printJson(output));
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should prompt for workflow name and continue", async () => {
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    require("@jyfti/engine").engine.getOutput.mockReturnValue(output);
    await execute(undefined);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      logSymbols.success + " Initialized"
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      printStepResult({ path: [], evaluation: null })
    );
    expect(logSpy).toHaveBeenNthCalledWith(3, printJson(output));
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should give more output in verbose mode", async () => {
    const initialState = {
      path: [0],
      inputs: {},
      evaluations: [],
    };
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    require("@jyfti/engine").engine.init.mockReturnValue(initialState);
    require("@jyfti/engine").engine.getOutput.mockReturnValue(output);
    await execute("my-workflow", [], { verbose: true });
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      logSymbols.success + " Initialized"
    );
    expect(logSpy).toHaveBeenNthCalledWith(2, printJson(initialState));
    expect(logSpy).toHaveBeenNthCalledWith(3, printStepResult(stepResult));
    expect(logSpy).toHaveBeenNthCalledWith(4, printJson(output));
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should print an error if the engine reports an error", async () => {
    const stepResult = { path: [0], error: new Error("Something went wrong.") };
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    await execute("my-workflow");
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      logSymbols.success + " Initialized"
    );
    expect(logSpy).toHaveBeenNthCalledWith(2, printStepResult(stepResult));
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });
});
