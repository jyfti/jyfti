/* eslint-disable @typescript-eslint/no-explicit-any */
import { printStepResult } from "../../print.service";
import { complete } from "./complete.command";
import { of } from "rxjs";

jest.mock("../../data-access/workflow.dao", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../data-access/config.dao");
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
  validateEnvironmentOrTerminate: () => Promise.resolve(),
}));
jest.mock("../../inquirer.service", () => ({
  promptWorkflow: () => Promise.resolve("my-workflow"),
}));
jest.mock("@jyfti/engine", () => {
  const engine = {
    complete: jest.fn(() => require("rxjs").empty()),
    transitionFrom: jest.fn(() => (stepResult$) =>
      stepResult$.pipe(require("rxjs/operators").map(() => ({})))
    ),
    getOutput: () => ({}),
    resolveStep: () => ({}),
  };
  return {
    engine,
    createEngine: () => engine,
    isSuccess: jest.requireActual("@jyfti/engine").isSuccess,
    isFailure: jest.requireActual("@jyfti/engine").isFailure,
  };
});

describe("the complete command", () => {
  const stepResult = { path: [], evaluation: "a" };

  let logSpy: any;
  let errorSpy: any;
  let writeStateSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeStateSpy = require("../../data-access/state.dao").writeState;
  });

  it("should complete a workflow", async () => {
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    await complete("my-workflow");
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      printStepResult({ path: [], evaluation: null })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should prompt for workflow name and continue", async () => {
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    await complete(undefined);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      printStepResult({ path: [], evaluation: null })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should print an error if the engine reports an error", async () => {
    const stepResult = { path: [0], error: new Error("Something went wrong.") };
    require("@jyfti/engine").engine.complete.mockReturnValue(of(stepResult));
    await complete("my-workflow");
    expect(logSpy).toHaveBeenNthCalledWith(1, printStepResult(stepResult));
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });
});
