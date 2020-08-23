import {
  validateWorkflowOrTerminate,
  validateInputsOrTerminate,
  validateEnvironmentOrTerminate,
  createInputs,
} from "./workflow.service";
import { Workflow } from "../../engine/types";

jest.mock("../../engine/services/validator");

describe("interacting with workflows via http and files", () => {
  let mockExit: any;

  beforeEach(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("validates a workflow and proceeds if there are no errors", () => {
    require("../../engine/services/validator").__setResponse(true);
    validateWorkflowOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates a workflow and terminates if there are errors", () => {
    require("../../engine/services/validator").__setResponse(false);
    validateWorkflowOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("validates inputs and proceeds if there are no errors", () => {
    require("../../engine/services/validator").__setResponse(true);
    validateInputsOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates inputs and terminates if there are errors", () => {
    require("../../engine/services/validator").__setResponse(false);
    validateInputsOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("validates an environment and proceeds if there are no errors", () => {
    require("../../engine/services/validator").__setResponse(true);
    validateEnvironmentOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it("validates an environment and terminates if there are errors", () => {
    require("../../engine/services/validator").__setResponse(false);
    validateEnvironmentOrTerminate({} as Workflow, {});
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("create inputs from a list", () => {
    expect(
      createInputs(
        {
          name: "MyWorkflow",
          inputs: { a: { type: "string" }, b: { type: "string" } },
          steps: [],
        },
        ["value1", "value2"]
      )
    ).toEqual({ a: "value1", b: "value2" });
  });
});
