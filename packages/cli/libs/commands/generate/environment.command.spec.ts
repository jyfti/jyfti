/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateEnvironment } from "./environment.command";

jest.mock("../../data-access/config-file.service");
jest.mock("../../data-access/environment-file.service", () => ({
  writeEnvironment: () => Promise.resolve(),
  environmentExists: jest.fn(() => Promise.resolve(true)),
}));
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
    require("../../data-access/environment-file.service").environmentExists.mockImplementation(
      () => Promise.resolve(true)
    );
    await generateEnvironment("my-environment");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "The environment already exists. Please delete the environment first."
    );
    expect(process.exitCode).toEqual(1);
  });

  it("should succeed if the environment does not already exists", async () => {
    require("../../data-access/environment-file.service").environmentExists.mockImplementation(
      () => Promise.resolve(false)
    );
    await generateEnvironment("my-environment");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });

  it("should prompt for an environment name if not provided", async () => {
    await generateEnvironment(undefined);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
    expect(process.exitCode).toEqual(0);
  });
});
