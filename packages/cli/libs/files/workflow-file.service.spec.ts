import {
  readWorkflow,
  readWorkflowOrTerminate,
  readWorkflowNames,
} from "./workflow-file.service";
import { Config } from "../types/config";

jest.mock("./file.service", () => ({
  readJson: jest.fn(() => Promise.resolve({})),
  listDirFiles: jest.fn(() => Promise.resolve([])),
}));

describe("interacting with workflow files", () => {
  const config: Config = {
    envRoot: "",
    outRoot: "",
    sourceRoot: "my-workflows/",
    schemaLocation: "",
  };

  it("reads a workflow", async () => {
    expect(await readWorkflow(config, "my-workflow")).toEqual({});
  });

  it("reads a workflow and does not terminate if it exists", async () => {
    expect(await readWorkflowOrTerminate(config, "my-workflow")).toEqual({});
  });

  it("reads a workflow and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").readJson.mockImplementation(() =>
      Promise.reject()
    );
    await readWorkflowOrTerminate(config, "my-workflow");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("reads the list of workflow files", async () => {
    require("./file.service").listDirFiles.mockImplementation(() =>
      Promise.resolve(["a.json", "b.json", "c.js"])
    );
    expect(await readWorkflowNames(config)).toEqual(["a", "b"]);
  });

  it("propagates an error from reading the workflow files", async () => {
    require("./file.service").listDirFiles.mockImplementation(() =>
      Promise.reject()
    );
    await readWorkflowNames(config)
      .then(() => fail())
      .catch(() => {});
  });
});
