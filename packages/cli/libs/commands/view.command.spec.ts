/* eslint-disable @typescript-eslint/no-explicit-any */
import { view } from "./view.command";
import { printJson } from "../print.service";

jest.mock("../files/config-file.service");
jest.mock("../inquirer.service", () => ({
  promptWorkflow: () =>
    Promise.resolve({
      name: "my-workflow",
      steps: [],
    }),
}));
jest.mock("../files/workflow-file.service", () => ({
  readWorkflowOrTerminate: () =>
    Promise.resolve({
      name: "my-workflow",
      steps: [],
    }),
  readWorkflowNamesOrTerminate: () =>
    Promise.resolve(["my-workflow", "my-other-workflow"]),
}));

describe("the view command", () => {
  let logSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should read a workflow via name and print it", async () => {
    await view("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(
      printJson({
        name: "my-workflow",
        steps: [],
      })
    );
  });

  it("should read prompt for the workflow name, read the workflow and print it", async () => {
    await view(undefined);
    expect(logSpy).toHaveBeenCalledWith(
      printJson({
        name: "my-workflow",
        steps: [],
      })
    );
  });
});
