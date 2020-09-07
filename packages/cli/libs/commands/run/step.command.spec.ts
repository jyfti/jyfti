/* eslint-disable @typescript-eslint/no-explicit-any */
import { step } from "./step.command";
import { printStepResult } from "../../print.service";
import { of } from "rxjs";

jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/state.dao", () => ({
  readStateOrTerminate: () => Promise.resolve({}),
  writeState: jest.fn(() => Promise.resolve()),
}));
jest.mock("../../data-access/environment.dao", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../validator", () => ({
  validateEnvironmentOrTerminate: () => Promise.resolve(),
}));
jest.mock("../../data-access/workflow.dao");
jest.mock("../../inquirer.service");
jest.mock("@jyfti/engine", () => {
  const engine = {
    isComplete: jest.fn(() => true),
    step: jest.fn(() => require("rxjs").empty()),
    transitionFrom: jest.fn(() => (stepResult$) =>
      stepResult$.pipe(require("rxjs/operators").map(() => ({})))
    ),
    resolveStep: () => ({}),
  };
  return {
    engine,
    createEngine: () => engine,
    isSuccess: jest.requireActual("@jyfti/engine").isSuccess,
    isFailure: jest.requireActual("@jyfti/engine").isFailure,
  };
});

describe("the step command", () => {
  let logSpy: any;
  let errorSpy: any;
  let writeStateSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeStateSpy = require("../../data-access/state.dao").writeState;
  });

  it("should execute the next step", async () => {
    require("@jyfti/engine").engine.isComplete.mockReturnValue(false);
    require("@jyfti/engine").engine.step.mockReturnValue(
      of({
        path: [0],
        evaluation: "a",
      })
    );
    await step("my-workflow", { verbose: false });
    expect(logSpy).toHaveBeenCalledWith(
      printStepResult({ path: [0], evaluation: null })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should return if already completed", async () => {
    require("@jyfti/engine").engine.isComplete.mockReturnValue(true);
    await step("my-workflow", { verbose: false });
    expect(logSpy).toHaveBeenCalledWith("Workflow execution already completed");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(0);
  });

  it("should log a failed state if the engine returns an error", async () => {
    require("@jyfti/engine").engine.isComplete.mockReturnValue(false);
    require("@jyfti/engine").engine.step.mockReturnValue(
      of({
        path: [0],
        error: "Something went wrong.",
      })
    );
    await step("my-workflow", { verbose: false });
    expect(logSpy).toHaveBeenCalledWith(
      printStepResult({ path: [0], error: "Something went wrong." })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(0);
  });
});
