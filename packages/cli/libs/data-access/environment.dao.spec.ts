import { Config } from "../types/config";
import {
  readEnvironmentOrTerminate,
  readEnvironmentNames,
} from "./environment.dao";

jest.mock("./file.service", () => ({
  readJson: jest.fn(() => Promise.resolve({})),
  listDirFiles: jest.fn(() => Promise.resolve([])),
}));

describe("interacting with environment files", () => {
  const config: Config = {
    envRoot: "my-environments/",
    outRoot: "",
    sourceRoot: "",
    schemaLocation: "",
  };

  it("reads an environment and does not terminate if it exists", async () => {
    expect(await readEnvironmentOrTerminate(config, "my-workflow")).toEqual({});
  });

  it("reads an environment and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").readJson.mockImplementation(() =>
      Promise.reject()
    );
    await readEnvironmentOrTerminate(config, "my-workflow");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("reads the list of environment files", async () => {
    require("./file.service").listDirFiles.mockImplementation(() =>
      Promise.resolve(["a.json", "b.json", "c.js"])
    );
    expect(await readEnvironmentNames(config)).toEqual(["a", "b"]);
  });

  it("propagates an error from reading the environment files", async () => {
    require("./file.service").listDirFiles.mockImplementation(() =>
      Promise.reject()
    );
    await readEnvironmentNames(config)
      .then(() => fail())
      .catch(() => {});
  });
});
