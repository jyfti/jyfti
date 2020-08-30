import { list } from "./list.command";

jest.mock("../data-access/config.dao");
jest.mock("../data-access/workflow.dao", () => ({
  readWorkflowNamesOrTerminate: () =>
    Promise.resolve(["my-workflow", "my-other-workflow"]),
}));

describe("the list command", () => {
  it("should list the installed workflows by name", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await list();
    expect(logSpy).toHaveBeenCalledWith("my-workflow\nmy-other-workflow");
  });
});
