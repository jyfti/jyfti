/* eslint-disable @typescript-eslint/no-explicit-any */
import { vars } from "./vars.command";
import { printJson } from "../../print.service";

jest.mock("../../files/workflow-file.service", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service", () => ({
  readStateOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../files/environment-file.service", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../inquirer.service", () => ({
  promptWorkflow: () => Promise.resolve("my-workflow"),
}));
jest.mock("@jyfti/engine", () => require("../../../__mocks__/@jyfti/engine"));

describe("the vars command", () => {
  const variableMap = { var1: "a" };

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    require("@jyfti/engine").__setVariableMap(variableMap);
  });

  it("should print the variables of a workflow", async () => {
    await vars("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printJson(variableMap));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for a workflow name if none is given", async () => {
    await vars(undefined);
    expect(logSpy).toHaveBeenCalledWith(printJson(variableMap));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
