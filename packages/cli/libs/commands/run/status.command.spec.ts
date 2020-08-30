/* eslint-disable @typescript-eslint/no-explicit-any */
import { printValue } from "../../print.service";
import { status } from "./status.command";

jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/state-file.service", () => ({
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
    require("../../data-access/state-file.service").readState.mockImplementation(
      () => Promise.reject()
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printValue("[Not running]"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status 'Pending' for a pending workflow", async () => {
    require("../../data-access/state-file.service").readState.mockImplementation(
      () =>
        Promise.resolve({
          path: [0],
          inputs: {},
          evaluations: [],
        })
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(
      printValue("[Pending]") + " At step [0]"
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status 'Completed' for a completed workflow", async () => {
    require("../../data-access/state-file.service").readState.mockImplementation(
      () =>
        Promise.resolve({
          path: [],
          inputs: {},
          evaluations: [],
        })
    );
    await status("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printValue("[Completed]"));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should print the status of all workflows if no name is given", async () => {
    require("../../data-access/state-file.service").readState.mockImplementation(
      () =>
        Promise.resolve({
          path: [],
          inputs: {},
          evaluations: [],
        })
    );
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
