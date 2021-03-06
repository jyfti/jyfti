/* eslint-disable @typescript-eslint/no-explicit-any */
import { state } from "./state.command";
import { printJson } from "../../print.service";

jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/state.dao", () => ({
  readStateOrTerminate: () =>
    Promise.resolve({
      path: [0],
      inputs: {},
      evaluations: [],
    }),
}));
jest.mock("../../data-access/workflow.dao", () => ({
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../inquirer.service", () => ({
  promptWorkflow: () => Promise.resolve("my-workflow"),
}));

describe("the state command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should print the state of a workflow", async () => {
    await state("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(
      printJson({
        path: [0],
        inputs: {},
        evaluations: [],
      })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for a workflow name if none is given", async () => {
    await state(undefined);
    expect(logSpy).toHaveBeenCalledWith(
      printJson({
        path: [0],
        inputs: {},
        evaluations: [],
      })
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
