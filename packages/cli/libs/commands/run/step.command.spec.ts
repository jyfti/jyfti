/* eslint-disable @typescript-eslint/no-explicit-any */
import { step } from "./step.command";
import { printSuccess, printError } from "../../print.service";
import { of, throwError } from "rxjs";

jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service", () => ({
  readStateOrTerminate: () => Promise.resolve({}),
  writeState: jest.fn(() => Promise.resolve()),
}));
jest.mock("../../files/environment-file.service", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../validator", () => ({
  validateEnvironmentOrTerminate: () => Promise.resolve(),
}));
jest.mock("../../files/workflow-file.service");
jest.mock("../../inquirer.service");
jest.mock("@jyfti/engine", () => {
  const engine = {
    isComplete: jest.fn(() => true),
    step: jest.fn(() => require("rxjs").empty()),
    transition: jest.fn(() => ({})),
  };
  return {
    engine,
    createEngine: () => engine,
  };
});

describe("the step command", () => {
  let logSpy: any;
  let errorSpy: any;
  let writeStateSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeStateSpy = require("../../files/state-file.service").writeState;
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
    expect(logSpy).toHaveBeenCalledWith("Completed " + printSuccess("[0]"));
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
      throwError("Something went wrong.")
    );
    await step("my-workflow", { verbose: false });
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "Failed " + printError("Something went wrong.")
    );
    expect(writeStateSpy).toHaveBeenCalledTimes(0);
  });
});
