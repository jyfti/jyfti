import { readWorkflowSchemaOrTerminate } from "./schema.dao";
import { Config } from "../types/config";

jest.mock("./file.service", () => ({
  readJson: jest.fn(() => Promise.resolve({})),
}));

describe("interacting with workflow schemas", () => {
  const config: Config = {
    envRoot: "",
    outRoot: "",
    sourceRoot: "my-workflows/",
    schemaLocation: "",
  };

  it("reads a workflow schema and does not terminate if it exists", async () => {
    expect(await readWorkflowSchemaOrTerminate(config)).toEqual({});
  });

  it("reads a workflow schema and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").readJson.mockImplementation(() =>
      Promise.reject()
    );
    await readWorkflowSchemaOrTerminate(config);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
