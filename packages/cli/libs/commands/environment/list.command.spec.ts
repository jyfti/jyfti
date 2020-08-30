import { listEnvironments } from "./list.command";

jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/environment-file.service", () => ({
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
