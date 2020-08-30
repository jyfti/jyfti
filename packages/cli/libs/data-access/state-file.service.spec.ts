import { Config } from "../types/config";
import { readState, readStateOrTerminate } from "./state-file.service";

jest.mock("./file.service", () => ({
  readJson: jest.fn(() => Promise.resolve({})),
}));

describe("interacting with state files", () => {
  const config: Config = {
    envRoot: "",
    outRoot: "",
    sourceRoot: "my-workflows/",
    schemaLocation: "",
  };

  it("reads a state", async () => {
    expect(await readState(config, "my-workflow")).toEqual({});
  });

  it("reads a state and does not terminate if it exists", async () => {
    expect(await readStateOrTerminate(config, "my-workflow")).toEqual({});
  });

  it("reads a state and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").readJson.mockImplementation(() =>
      Promise.reject()
    );
    await readStateOrTerminate(config, "my-workflow");
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
