import { view } from "./view.command";
import { printJson } from "../print.service";

jest.mock("../files/config-file.service");
jest.mock("../inquirer.service");
jest.mock("../files/workflow.service");

describe("the view command", () => {
  it("should read a workflow via name and print it", async () => {
    const workflow = {
      name: "my-workflow",
      steps: [],
    };
    require("../files/workflow.service").__setWorkflow(workflow);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await view("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printJson(workflow));
  });

  it("should read prompt for the workflow name, read the workflow and print it", async () => {
    const workflow = {
      name: "my-workflow",
      steps: [],
    };
    require("../files/workflow.service").__setWorkflow(workflow);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await view(undefined);
    expect(logSpy).toHaveBeenCalledWith(printJson(workflow));
  });
});
