/* eslint-disable @typescript-eslint/no-explicit-any */
import { step } from "./step.command";
import { printSuccess, printError } from "../../print.service";

jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service", () => ({
  readStateOrTerminate: jest.fn(() => Promise.resolve({})),
}));
jest.mock("../../files/environment-file.service", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../files/workflow.service");
jest.mock("../../files/workflow-file.service");
jest.mock("../../inquirer.service");
jest.mock("@jyfti/engine", () => require("../../../__mocks__/@jyfti/engine"));

describe("the step command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should execute the next step", async () => {
    require("../../files/state-file.service").readStateOrTerminate.mockImplementation(
      () =>
        Promise.resolve({
          path: [0],
          inputs: {},
          evaluations: [],
        })
    );
    require("@jyfti/engine").__setStepResult({
      path: [0],
      evaluation: "a",
    });
    await step("my-workflow", { verbose: false });
    expect(logSpy).toHaveBeenCalledWith("Completed " + printSuccess("[0]"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should return if already completed", async () => {
    require("../../files/state-file.service").readStateOrTerminate.mockImplementation(
      () =>
        Promise.resolve({
          path: [],
          inputs: {},
          evaluations: [],
        })
    );
    require("@jyfti/engine").__setStepResult({
      path: [],
      evaluation: "a",
    });
    await step("my-workflow", { verbose: false });
    expect(logSpy).toHaveBeenCalledWith("Workflow execution already completed");
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should log a failed state if the engine returns an error", async () => {
    require("../../files/state-file.service").readStateOrTerminate.mockImplementation(
      () =>
        Promise.resolve({
          path: [0],
          inputs: {},
          evaluations: [],
        })
    );
    require("@jyfti/engine").__setStepResult(undefined);
    await step("my-workflow", { verbose: false });
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "Failed " + printError("Something went wrong.")
    );
  });
});
