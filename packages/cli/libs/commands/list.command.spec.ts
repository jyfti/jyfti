import { list } from "./list.command";

jest.mock("../files/config-file.service");
jest.mock("../files/workflow-file.service");

describe("the list command", () => {
  it("should list the installed workflows by name", async () => {
    const names = ["my-workflow", "my-other-workflow"];
    require("../files/workflow-file.service").__setWorkflowNames(names);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await list();
    expect(logSpy).toHaveBeenCalledWith("my-workflow\nmy-other-workflow");
  });
});
