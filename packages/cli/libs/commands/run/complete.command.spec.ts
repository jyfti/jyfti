/* eslint-disable @typescript-eslint/no-explicit-any */
import { printJson, printSuccess, printError } from "../../print.service";
import { complete } from "./complete.command";

jest.mock("../../files/workflow-file.service", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service", () => ({
  readStateOrTerminate: () =>
    Promise.resolve({
      path: [0],
      inputs: {},
      evaluations: [],
    }),
}));
jest.mock("../../files/environment-file.service", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../files/workflow.service");
jest.mock("../../inquirer.service");
jest.mock("@jyfti/engine", () => require("../../../__mocks__/@jyfti/engine"));

describe("the complete command", () => {
  const workflow = { name: "my-workflow", steps: [] };
  const stepResult = { path: [], evaluation: "a" };

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    require("../../files/workflow.service").__setWorkflow(workflow);
  });

  it("should complete a workflow", async () => {
    require("@jyfti/engine").__setStepResult(stepResult);
    await complete("my-workflow");
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "Completed " + printSuccess("[]")
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for workflow name and continue", async () => {
    require("@jyfti/engine").__setStepResult(stepResult);
    await complete(undefined);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      "Completed " + printSuccess("[]")
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should give more output in verbose mode", async () => {
    require("@jyfti/engine").__setStepResult(stepResult);
    await complete("my-workflow", { verbose: true });
    expect(logSpy).toHaveBeenNthCalledWith(1, printJson(stepResult));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print an error if the engine reports an error", async () => {
    require("@jyfti/engine").__setStepResult(undefined);
    await complete("my-workflow");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenNthCalledWith(
      1,
      "Failed " + printError("Something went wrong.")
    );
  });
});
