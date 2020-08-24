import {
  validateWorkflowOrTerminate,
  validateInputsOrTerminate,
  validateEnvironmentOrTerminate,
} from "./workflow.service";
import { Workflow } from "@jyfti/engine";

jest.mock("@jyfti/engine", () => require("../../../__mocks__/@jyfti/validator"));

describe("interacting with workflows via http and files", () => {
  let mockExit: any;

  beforeEach(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("validates a workflow and proceeds if there are no errors", () => {
    require("@jyfti/engine").__setResponse(true);
    validateWorkflowOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates a workflow and terminates if there are errors", () => {
    require("@jyfti/engine").__setResponse(false);
    validateWorkflowOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("validates inputs and proceeds if there are no errors", () => {
    require("@jyfti/engine").__setResponse(true);
    validateInputsOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates inputs and terminates if there are errors", () => {
    require("@jyfti/engine").__setResponse(false);
    validateInputsOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("validates an environment and proceeds if there are no errors", () => {
    require("@jyfti/engine").__setResponse(true);
    validateEnvironmentOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates an environment and terminates if there are errors", () => {
    require("@jyfti/engine").__setResponse(false);
    validateEnvironmentOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
