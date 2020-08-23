import { Config } from "../types/config";
import { readState, readStateOrTerminate } from "./state-file.service";

jest.mock("./file.service");

describe("interacting with workflow files", () => {
  const config: Config = {
    envRoot: "",
    outRoot: "",
    sourceRoot: "my-workflows/",
  };

  it("reads a state", async () => {
    require("./file.service").__setResponse(true);
    expect(await readState(config, "my-workflow")).toEqual({});
  });

  it("reads a state and does not terminate if it exists", async () => {
    require("./file.service").__setResponse(true);
    expect(await readStateOrTerminate(config, "my-workflow")).toEqual({});
  });

  it("reads a state and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").__setResponse(false);
    await readStateOrTerminate(config, "my-workflow");
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
