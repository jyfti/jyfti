/* eslint-disable @typescript-eslint/no-explicit-any */
import { init } from "./init.command";

jest.mock("../data-access/config.dao");
jest.mock("../data-access/file.service");
jest.mock("inquirer", () => ({
  prompt: () =>
    Promise.resolve({
      envRoot: "envRootValue",
      sourceRoot: "sourceRootValue",
      outRoot: "outRootValue",
    }),
}));

describe("the init command", () => {
  const files = require("../data-access/file.service");

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should initialize", async () => {
    files.fileExists = () => Promise.resolve(false);
    files.ensureDirExists = () => Promise.resolve();
    await init();
    expect(logSpy).toHaveBeenCalledWith("Initialized Jyfti project.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should fail if a config file already exists", async () => {
    files.fileExists = () => Promise.resolve(true);
    await init();
    expect(logSpy).toHaveBeenCalledWith(
      "This directory is already initialized."
    );
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
