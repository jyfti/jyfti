/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  validateWorkflowOrTerminate,
  validateInputsOrTerminate,
  validateEnvironmentOrTerminate,
} from "./workflow.service";
import { Workflow } from "@jyfti/engine";

jest.mock("@jyfti/engine", () => ({
  validateWorkflow: jest.fn(() => []),
  validateInputs: jest.fn(() => ({})),
  validateEnvironment: jest.fn(() => ({})),
}));

describe("interacting with workflows via http and files", () => {
  let mockExit: any;

  beforeEach(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("validates a workflow and proceeds if there are no errors", () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue([]);
    validateWorkflowOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates a workflow and terminates if there are errors", () => {
    require("@jyfti/engine").validateWorkflow.mockReturnValue(["error"]);
    validateWorkflowOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("validates inputs and proceeds if there are no errors", () => {
    require("@jyfti/engine").validateInputs.mockReturnValue({});
    validateInputsOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates inputs and terminates if there are errors", () => {
    require("@jyfti/engine").validateInputs.mockReturnValue({
      field1: ["error"],
    });
    validateInputsOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("validates an environment and proceeds if there are no errors", () => {
    require("@jyfti/engine").validateEnvironment.mockReturnValue({});
    validateEnvironmentOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates an environment and terminates if there are errors", () => {
    require("@jyfti/engine").validateEnvironment.mockReturnValue({
      field1: ["error"],
    });
    validateEnvironmentOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
