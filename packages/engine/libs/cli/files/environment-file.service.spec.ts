import { Config } from "../types/config";
import {
  readEnvironmentOrTerminate,
  readEnvironmentNames,
} from "./environment-file.service";

jest.mock("./file.service");

describe("interacting with environment files", () => {
  const config: Config = {
    envRoot: "my-environments/",
    outRoot: "",
    sourceRoot: "",
  };

  it("reads an environment and does not terminate if it exists", async () => {
    require("./file.service").__setResponse(true);
    expect(await readEnvironmentOrTerminate(config, "my-workflow")).toEqual({});
  });

  it("reads an environment and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").__setResponse(false);
    await readEnvironmentOrTerminate(config, "my-workflow");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("reads the list of environment files", async () => {
    require("./file.service").__setResponse(true);
    expect(await readEnvironmentNames(config)).toEqual(["a", "b"]);
  });

  it("propagates an error from reading the environment files", async () => {
    require("./file.service").__setResponse(false);
    await readEnvironmentNames(config)
      .then(() => fail())
      .catch(() => {});
  });
});
