/* eslint-disable @typescript-eslint/no-explicit-any */
import { printValue, printSuccess, printError } from "../../print.service";
import { status } from "./status.command";

jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/state.dao", () => ({
  stateExists: jest.fn(() => Promise.resolve(true)),
  readState: jest.fn(() => Promise.resolve({})),
}));
jest.mock("../../data-access/workflow.dao", () => ({
  readWorkflowNamesOrTerminate: () =>
    Promise.resolve(["my-workflow", "my-other-workflow"]),
}));

describe("the status command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should print the status 'Not running' for a workflow with an undefined state", async () => {
    require("../../data-access/state.dao").stateExists.mockReturnValue(
      Promise.resolve(false)
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printValue("[Not running]"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status 'Pending' for a pending workflow", async () => {
    require("../../data-access/state.dao").stateExists.mockReturnValue(
      Promise.resolve(true)
    );
    require("../../data-access/state.dao").readState.mockReturnValue(
      Promise.resolve({
        path: [0],
        inputs: {},
        evaluations: [],
      })
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(
      printValue("[Pending]") + " At step " + printValue("[0]")
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status 'Completed' for a completed workflow", async () => {
    require("../../data-access/state.dao").stateExists.mockReturnValue(
      Promise.resolve(true)
    );
    require("../../data-access/state.dao").readState.mockReturnValue(
      Promise.resolve({
        path: [],
        inputs: {},
        evaluations: [],
      })
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printSuccess("[Completed]"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print an error message for an invalid state json", async () => {
    require("../../data-access/state.dao").stateExists.mockReturnValue(
      Promise.resolve(true)
    );
    require("../../data-access/state.dao").readState.mockReturnValue(
      Promise.reject("JSON is broken")
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printError("JSON is broken"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status 'Failed' for a failed workflow", async () => {
    require("../../data-access/state.dao").stateExists.mockReturnValue(
      Promise.resolve(true)
    );
    require("../../data-access/state.dao").readState.mockReturnValue(
      Promise.resolve({
        path: [0],
        inputs: {},
        evaluations: [],
        error: "Something went wrong.",
      })
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(
      printError("[Failed]") +
        " At step " +
        printValue("[0]") +
        " with error Something went wrong."
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status of all workflows if no name is given", async () => {
    require("../../data-access/state.dao").stateExists.mockReturnValue(
      Promise.resolve(true)
    );
    require("../../data-access/state.dao").readState.mockReturnValue(
      Promise.resolve({
        path: [],
        inputs: {},
        evaluations: [],
      })
    );
    await status(undefined);
    expect(logSpy).toHaveBeenCalledWith(
      "my-workflow " +
        printSuccess("[Completed]") +
        "\n" +
        "my-other-workflow " +
        printSuccess("[Completed]")
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
