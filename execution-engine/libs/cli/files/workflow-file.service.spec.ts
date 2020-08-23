import {
  readWorkflow,
  readWorkflowOrTerminate,
  readWorkflowSchemaOrTerminate,
} from "./workflow-file.service";
import { Config } from "../types/config";

jest.mock("./file.service");

describe("interacting with workflow files", () => {
  const config: Config = {
    envRoot: "",
    outRoot: "",
    sourceRoot: "my-workflows/",
  };

  it("reads a workflow", async () => {
    require("./file.service").__setResponse(true);
    expect(await readWorkflow(config, "my-workflow")).toEqual({});
  });

  it("reads a workflow and does not terminate if it exists", async () => {
    require("./file.service").__setResponse(true);
    expect(await readWorkflowOrTerminate(config, "my-workflow")).toEqual({});
  });

  it("reads a workflow and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").__setResponse(false);
    await readWorkflowOrTerminate(config, "my-workflow");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("reads a workflow schema and does not terminate if it exists", async () => {
    require("./file.service").__setResponse(true);
    expect(await readWorkflowSchemaOrTerminate()).toEqual({});
  });

  it("reads a workflow schema and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").__setResponse(false);
    await readWorkflowSchemaOrTerminate();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
