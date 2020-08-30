/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from "./validate.command";
import { printJson, printValue } from "../print.service";

jest.mock("../files/config-file.service");
jest.mock("../files/workflow-file.service", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () =>
    Promise.resolve(["my-workflow", "my-other-workflow"]),
}));
jest.mock("@jyfti/engine", () => require("../../__mocks__/@jyfti/validator"));
jest.mock("../inquirer.service", () => ({
  promptWorkflow: () => Promise.resolve("my-workflow"),
}));

describe("the validate command", () => {
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
    require("@jyfti/engine").__setResponse(true);
    await validate("my-workflow", { all: false });
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });

  it("should validate a single invalid workflow with errors", async () => {
    const error = require("@jyfti/engine").error;
    require("@jyfti/engine").__setResponse(false);
    await validate("my-workflow", { all: false });
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledWith(
      `In ${printValue("my-workflow")}:\n` + printJson(error)
    );
    expect(process.exitCode).toEqual(1);
  });

  it("should validate all workflows with option --all without output if all are valid", async () => {
    require("@jyfti/engine").__setResponse(true);
    await validate(undefined, { all: true });
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });

  it("should validate all workflows with option --all and print errors", async () => {
    const error = require("@jyfti/engine").error;
    require("@jyfti/engine").__setResponse(false);
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
