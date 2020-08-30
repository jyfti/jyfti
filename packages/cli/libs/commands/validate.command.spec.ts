/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from "./validate.command";
import { printJson, printValue } from "../print.service";

jest.mock("../data-access/config.dao");
jest.mock("../data-access/workflow.dao", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () =>
    Promise.resolve(["my-workflow", "my-other-workflow"]),
}));
jest.mock("../data-access/workflow-schema.service", () => ({
  readWorkflowSchemaOrTerminate: () => Promise.resolve({}),
}));
jest.mock("@jyfti/engine", () => ({
  validateWorkflow: jest.fn(() => []),
}));
jest.mock("../inquirer.service", () => ({
  promptWorkflow: () => Promise.resolve("my-workflow"),
}));

describe("the validate command", () => {
  const error = {
    keyword: "a",
    dataPath: "b",
    schemaPath: "c",
    params: {},
  };

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.exitCode = 0;
  });

  it("should disallow --all and a name to be set", async () => {
    await validate("my-workflow", { all: true });
    expect(process.exitCode).toEqual(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("should validate a single valid workflow without output", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([]);
    await validate("my-workflow", { all: false });
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });

  it("should validate a single invalid workflow with errors", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([error]);
    await validate("my-workflow", { all: false });
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledWith(
      `In ${printValue("my-workflow")}:\n` + printJson(error)
    );
    expect(process.exitCode).toEqual(1);
  });

  it("should validate all workflows with option --all without output if all are valid", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([]);
    await validate(undefined, { all: true });
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });

  it("should validate all workflows with option --all and print errors", async () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([error]);
    await validate(undefined, { all: true });
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledWith(
      `In ${printValue("my-workflow")}:\n` +
        printJson(error) +
        "\n\n" +
        `In ${printValue("my-other-workflow")}:\n` +
        printJson(error)
    );
    expect(process.exitCode).toEqual(1);
  });
});
