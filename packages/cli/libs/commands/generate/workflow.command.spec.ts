/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateWorkflow } from "./workflow.command";

jest.mock("../../files/config-file.service");
jest.mock("../../files/workflow-file.service", () => ({
  workflowExists: jest.fn(() => Promise.resolve(true)),
  writeWorkflow: () => Promise.resolve(),
}));
jest.mock("../../inquirer.service");

describe("the generate workflow command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.exitCode = 0;
  });

  it("should fail if the workflow already exists", async () => {
    require("../../files/workflow-file.service").workflowExists.mockImplementation(
      () => Promise.resolve(true)
    );
    await generateWorkflow("my-workflow");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "The workflow already exists. Please delete the workflow first."
    );
    expect(process.exitCode).toEqual(1);
  });

  it("should succeed if the workflow does not already exists", async () => {
    require("../../files/workflow-file.service").workflowExists.mockImplementation(
      () => Promise.resolve(false)
    );
    await generateWorkflow("my-workflow");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });

  it("should prompt for a workflow name if not provided", async () => {
    require("../../files/workflow-file.service").workflowExists.mockImplementation(
      () => Promise.resolve(false)
    );
    await generateWorkflow(undefined);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });
});
