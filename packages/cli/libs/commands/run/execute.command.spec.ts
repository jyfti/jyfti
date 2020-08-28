import { execute } from "./execute.command";
import { printJson, printSuccess, printError } from "../../print.service";

jest.mock("../../files/workflow-file.service");
jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service");
jest.mock("../../files/environment-file.service");
jest.mock("../../files/workflow.service");
jest.mock("../../inquirer.service");
jest.mock("@jyfti/engine", () => require("../../../__mocks__/@jyfti/engine"));

describe("the execute command", () => {
  const state = {
    path: [0],
    inputs: {},
    evaluations: [],
  };
  const environment = {};
  const workflow = { name: "my-workflow", steps: [] };
  const stepResult = { path: [], evaluation: "a" };

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    require("../../files/state-file.service").__setState(state);
    require("../../files/environment-file.service").__setEnvironment(
      environment
    );
    require("../../files/workflow-file.service").__setWorkflow(workflow);
    require("../../files/workflow.service").__setWorkflow(workflow);
  });

  it("should run of a workflow with no inputs to completion", async () => {
    require("@jyfti/engine").__setStepResult(stepResult);
    await execute("my-workflow");
    expect(logSpy).toHaveBeenNthCalledWith(1, "Created state.");
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      "Completed " + printSuccess("[]")
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      printJson({ myOutput: "output" })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for workflow name and continue", async () => {
    require("@jyfti/engine").__setStepResult(stepResult);
    await execute(undefined);
    expect(logSpy).toHaveBeenNthCalledWith(1, "Created state.");
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      "Completed " + printSuccess("[]")
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      printJson({ myOutput: "output" })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should give more output in verbose mode", async () => {
    require("@jyfti/engine").__setStepResult(stepResult);
    await execute("my-workflow", [], { verbose: true });
    expect(logSpy).toHaveBeenNthCalledWith(1, "Created state.");
    expect(logSpy).toHaveBeenNthCalledWith(2, printJson(state));
    expect(logSpy).toHaveBeenNthCalledWith(3, printJson(stepResult));
    expect(logSpy).toHaveBeenNthCalledWith(
      4,
      printJson({ myOutput: "output" })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print an error if the engine reports an error", async () => {
    require("@jyfti/engine").__setStepResult(undefined);
    await execute("my-workflow");
    expect(logSpy).toHaveBeenNthCalledWith(1, "Created state.");
    expect(errorSpy).toHaveBeenNthCalledWith(
      1,
      "Failed " + printError("Something went wrong.")
    );
  });
});
