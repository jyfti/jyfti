import { listEnvironments } from "./list.command";

jest.mock("../../files/config-file.service");
jest.mock("../../files/environment-file.service");

describe("the environment list command", () => {
  it("should list the installed environments by name", async () => {
    const names = ["default", "my-other-environment"];
    require("../../files/environment-file.service").__setEnvironmentNames(
      names
    );
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await listEnvironments();
    expect(logSpy).toHaveBeenCalledWith("default\nmy-other-environment");
  });
});
