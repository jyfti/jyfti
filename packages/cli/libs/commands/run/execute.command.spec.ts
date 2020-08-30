/* eslint-disable @typescript-eslint/no-explicit-any */
import { execute } from "./execute.command";
import { printJson, printSuccess, printError } from "../../print.service";
import { Workflow } from "@jyfti/engine";

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
jest.mock("../../files/workflow.service", () => ({
  readWorkflowOrTerminate: () => Promise.resolve({}),
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
jest.mock("@jyfti/engine", () => require("../../../__mocks__/@jyfti/engine"));

describe("the execute command", () => {
  const stepResult = { path: [], evaluation: "a" };

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
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
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      printJson({
        path: [0],
        inputs: {},
        evaluations: [],
      })
    );
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
