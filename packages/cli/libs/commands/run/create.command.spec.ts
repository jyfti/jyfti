/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "./create.command";
import { printValue } from "../../print.service";

jest.mock("../../files/workflow-file.service", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service", () => ({
  readStateOrTerminate: () => Promise.resolve({}),
  writeState: () => Promise.resolve(),
}));
jest.mock("../../files/environment-file.service", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../files/workflow.service");
jest.mock("../../install.service");
jest.mock("../../inquirer.service");
jest.mock("@jyfti/engine", () => require("../../../__mocks__/@jyfti/engine"));

describe("the create command", () => {
  const workflow = { name: "my-workflow", steps: [] };

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    require("../../files/workflow.service").__setWorkflow(workflow);
  });

  it("should create a new run of a workflow with no inputs", async () => {
    await create("my-workflow");
    expect(logSpy).toHaveBeenCalledWith("Created state.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for a name of a workflow if not provided", async () => {
    await create(undefined);
    expect(logSpy).toHaveBeenCalledWith("Created state.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should install if the workflow is a url", async () => {
    await create("https://localhost:8080/my-remote-workflow.json");
    expect(logSpy).toHaveBeenCalledWith(
      `Installed ${printValue("my-remote-workflow")} .`
    );
    expect(logSpy).toHaveBeenCalledWith(`Created state.`);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
