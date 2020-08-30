/* eslint-disable @typescript-eslint/no-explicit-any */
import { install } from "./install.service";
import { Config } from "./types/config";
import { Workflow, JsonSchema } from "@jyfti/engine";
import { printError } from "./print.service";

jest.mock("./data-access/workflow.dao", () => ({
  workflowExists: () => Promise.resolve(true),
  writeWorkflow: jest.fn(() => Promise.resolve()),
}));
jest.mock("@jyfti/engine", () => ({
  validateWorkflow: jest.fn(() => []),
}));
jest.mock("inquirer", () => ({
  prompt: jest.fn(() => Promise.resolve({ yes: true })),
}));

describe("the installation of a workflow", () => {
  const config: Config = {
    sourceRoot: "./",
    envRoot: "./",
    outRoot: "./",
    schemaLocation: "",
  };
  const workflow: Workflow = {
    name: "my-workflow",
    steps: [],
  };
  const schema: JsonSchema = {};

  let logSpy: any;
  let errorSpy: any;
  let writeWorkflowSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeWorkflowSpy = require("./data-access/workflow.dao").writeWorkflow;
  });

  afterEach(() => {
    process.exitCode = 0;
  });

  it("should fail if the workflow has errors", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue(["error"]);
    await install(config, workflow, schema, "my-workflow", true);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledWith(
      printError("The workflow is not valid.")
    );
    expect(writeWorkflowSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(1);
  });

  it("should overwrite an existing workflow if --yes is set", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([]);
    require("inquirer").prompt.mockImplementation(() =>
      Promise.resolve({ yes: true })
    );
    await install(config, workflow, schema, "my-workflow", true);
    expect(logSpy).toHaveBeenCalledWith("Successfully saved.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toEqual(0);
  });

  it("should overwrite an existing workflow if the user answers yes on the prompt", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([]);
    require("inquirer").prompt.mockImplementation(() =>
      Promise.resolve({ yes: true })
    );
    await install(config, workflow, schema, "my-workflow", false);
    expect(logSpy).toHaveBeenCalledWith("Successfully saved.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toEqual(0);
  });

  it("should not overwrite an existing workflow if the user answers no on the prompt", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([]);
    require("inquirer").prompt.mockImplementation(() =>
      Promise.resolve({ yes: false })
    );
    await install(config, workflow, schema, "my-workflow", false);
    expect(logSpy).toHaveBeenCalledWith("The workflow has not been saved.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeWorkflowSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });
});
