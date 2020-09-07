/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "./create.command";
import { printValue } from "../../print.service";
import { Workflow } from "@jyfti/engine";
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
  readStateOrTerminate: () => Promise.resolve({}),
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
jest.mock("../../install.service", () => ({
  install: jest.fn(() => Promise.resolve()),
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
  };
  return {
    engine,
    createEngine: () => engine,
  };
});

describe("the create command", () => {
  let logSpy: any;
  let errorSpy: any;
  let writeStateSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    writeStateSpy = require("../../data-access/state.dao").writeState;
  });

  it("should create a new run of a workflow with no inputs", async () => {
    await create("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(logSymbols.success + " Initialized");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should prompt for a name of a workflow if not provided", async () => {
    await create(undefined);
    expect(logSpy).toHaveBeenCalledWith(logSymbols.success + " Initialized");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(writeStateSpy).toHaveBeenCalledTimes(1);
  });

  it("should install if the workflow is a url", async () => {
    await create("https://localhost:8080/my-remote-workflow.json");
    expect(logSpy).toHaveBeenCalledWith(
      `Installed ${printValue("my-remote-workflow")} .`
    );
    expect(logSpy).toHaveBeenCalledWith(logSymbols.success + " Initialized");
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(require("../../install.service").install).toHaveBeenCalledTimes(1);
  });
});
