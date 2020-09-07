import { readWorkflow, readWorkflowNames } from "./workflow.dao";
import { Config } from "../types/config";

jest.mock("./file.service", () => ({
  readFile: jest.fn(() => Promise.resolve("{}")),
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
