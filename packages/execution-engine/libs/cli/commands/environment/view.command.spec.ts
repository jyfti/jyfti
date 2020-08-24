import { viewEnvironment } from "./view.command";
import { printJson } from "../../print.service";

jest.mock("../../files/config-file.service");
jest.mock("../../inquirer.service");
jest.mock("../../files/environment-file.service");

describe("the environment view command", () => {
  it("should read an environment via name and print it", async () => {
    const environment = {
      a: "b",
    };
    require("../../files/environment-file.service").__setEnvironment(environment);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await viewEnvironment("my-environment");
    expect(logSpy).toHaveBeenCalledWith(printJson(environment));
  });

  it("should prompt for the environment name, read the environment and print it", async () => {
    const environment = {
      a: "b",
    };
    require("../../files/environment-file.service").__setEnvironment(environment);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await viewEnvironment(undefined);
    expect(logSpy).toHaveBeenCalledWith(printJson(environment));
  });
});
