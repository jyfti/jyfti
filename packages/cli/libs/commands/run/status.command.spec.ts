/* eslint-disable @typescript-eslint/no-explicit-any */
import { printValue } from "../../print.service";
import { status } from "./status.command";

jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service");
jest.mock("../../files/workflow-file.service");

describe("the status command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should print the status 'Not running' for a workflow with an undefined state", async () => {
    require("../../files/state-file.service").__setState(undefined);
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printValue("[Not running]"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status 'Pending' for a pending workflow", async () => {
    const state = {
      path: [0],
      inputs: {},
      evaluations: [],
    };
    require("../../files/state-file.service").__setState(state);
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(
      printValue("[Pending]") + " At step [0]"
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status 'Completed' for a completed workflow", async () => {
    const state = {
      path: [],
      inputs: {},
      evaluations: [],
    };
    require("../../files/state-file.service").__setState(state);
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printValue("[Completed]"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status of all workflows if no name is given", async () => {
    const state = {
      path: [],
      inputs: {},
      evaluations: [],
    };
    require("../../files/state-file.service").__setState(state);
    require("../../files/workflow-file.service").__setWorkflowNames([
      "my-workflow",
      "my-other-workflow",
    ]);
    await status(undefined);
    expect(logSpy).toHaveBeenCalledWith(
      "my-workflow " +
        printValue("[Completed]") +
        "\n" +
        "my-other-workflow " +
        printValue("[Completed]")
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
