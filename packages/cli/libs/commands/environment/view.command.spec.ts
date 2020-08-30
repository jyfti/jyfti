import { viewEnvironment } from "./view.command";
import { printJson } from "../../print.service";

jest.mock("../../data-access/config-file.service");
jest.mock("../../data-access/environment-file.service", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({ a: "b" }),
  readEnvironmentNames: () => Promise.resolve(["my-environment"]),
}));
jest.mock("inquirer", () => ({
  prompt: () => Promise.resolve({ environment: "my-environment" }),
}));

describe("the environment view command", () => {
  it("should read an environment via name and print it", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await viewEnvironment("my-environment");
    expect(logSpy).toHaveBeenCalledWith(printJson({ a: "b" }));
  });

  it("should prompt for the environment name, read the environment and print it", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await viewEnvironment(undefined);
    expect(logSpy).toHaveBeenCalledWith(printJson({ a: "b" }));
  });
});
