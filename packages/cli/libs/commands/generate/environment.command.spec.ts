/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateEnvironment } from "./environment.command";

jest.mock("../../files/config-file.service");
jest.mock("../../files/environment-file.service");
jest.mock("../../inquirer.service");

describe("the generate environment command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.exitCode = 0;
  });

  it("should fail if the environment already exists", async () => {
    require("../../files/environment-file.service").__setEnvironment({});
    await generateEnvironment("my-environment");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "The environment already exists. Please delete the environment first."
    );
    expect(process.exitCode).toEqual(1);
  });

  it("should succeed if the environment does not already exists", async () => {
    require("../../files/environment-file.service").__setEnvironment(undefined);
    await generateEnvironment("my-environment");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });

  it("should prompt for an environment name if not provided", async () => {
    require("../../files/environment-file.service").__setEnvironment(undefined);
    await generateEnvironment(undefined);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });
});
