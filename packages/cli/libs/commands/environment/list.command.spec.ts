import { listEnvironments } from "./list.command";

jest.mock("../../files/config-file.service");
jest.mock("../../files/environment-file.service", () => ({
  readEnvironmentNames: () =>
    Promise.resolve(["default", "my-other-environment"]),
}));

describe("the environment list command", () => {
  it("should list the installed environments by name", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await listEnvironments();
    expect(logSpy).toHaveBeenCalledWith("default\nmy-other-environment");
  });
});
