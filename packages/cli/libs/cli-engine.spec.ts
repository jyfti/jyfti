import { State, Workflow } from "@jyfti/engine";
import logSymbols from "log-symbols";
import { of } from "rxjs";
import { initAndRunToCompletion, runStep } from "./cli-engine";
import { defaultConfig } from "./data-access/config.dao";
import { printJson, printStepResult } from "./print.service";

/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock("@jyfti/engine", () => {
  const engine = {
    init: jest.fn(() => ({})),
    step: jest.fn(() => require("rxjs").empty()),
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
    isComplete: jest.fn(() => true),
    isError: jest.fn(() => false),
  };
});
jest.mock("./data-access/state.dao", () => ({
  writeState: jest.fn(() => Promise.resolve()),
}));

describe("initializing and running to completion", () => {
  const stepResult = { path: [], evaluation: "a" };
  const output = { myOutput: "output" };

  let logSpy: any;
  let errorSpy: any;
  let writeStateSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeStateSpy = require("./data-access/state.dao").writeState;
  });

  it("should run of a workflow with no inputs to completion", async () => {
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    require("@jyfti/engine").engine.getOutput.mockReturnValue(output);
    await initAndRunToCompletion(
      ("my-workflow" as any) as Workflow,
      {},
      defaultConfig,
      {},
      "my-workflow",
      false
    );
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
    await initAndRunToCompletion(
      ("my-workflow" as any) as Workflow,
      {},
      defaultConfig,
      {},
      "my-workflow",
      true
    );
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
    await initAndRunToCompletion(
      ("my-workflow" as any) as Workflow,
      {},
      defaultConfig,
      {},
      "my-workflow",
      false
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      logSymbols.success + " Initialized"
    );
    expect(logSpy).toHaveBeenNthCalledWith(2, printStepResult(stepResult));
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });
});

describe("executing a step", () => {
  let logSpy: any;
  let errorSpy: any;
  let writeStateSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeStateSpy = require("./data-access/state.dao").writeState;
  });

  it("should execute the next step", async () => {
    require("@jyfti/engine").isComplete.mockReturnValue(false);
    require("@jyfti/engine").engine.step.mockReturnValue(
      of({
        path: [0],
        evaluation: "a",
      })
    );
    await runStep(
      ("my-workflow" as any) as Workflow,
      {},
      defaultConfig,
      "my-workflow",
      ({} as any) as State
    );
    expect(logSpy).toHaveBeenCalledWith(
      printStepResult({ path: [0], evaluation: null })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should return if already completed", async () => {
    require("@jyfti/engine").isComplete.mockReturnValue(true);
    await runStep(
      ("my-workflow" as any) as Workflow,
      {},
      defaultConfig,
      "my-workflow",
      ({} as any) as State
    );
    expect(logSpy).toHaveBeenCalledWith("Workflow execution already completed");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(0);
  });

  it("should log a failed state if the engine returns an error", async () => {
    const stepResult = {
      path: [0],
      error: new Error("Something went wrong."),
    };
    require("@jyfti/engine").isComplete.mockReturnValue(false);
    require("@jyfti/engine").engine.step.mockReturnValue(of(stepResult));
    await runStep(
      ("my-workflow" as any) as Workflow,
      {},
      defaultConfig,
      "my-workflow",
      ({} as any) as State
    );
    expect(logSpy).toHaveBeenCalledWith(printStepResult(stepResult));
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });
});
