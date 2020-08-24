import { vars } from "./vars.command";
import { printJson } from "../../print.service";

jest.mock("../../../engine/services/engine");
jest.mock("../../files/workflow-file.service");
jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service");
jest.mock("../../files/environment-file.service");
jest.mock("../../inquirer.service");

describe("the vars command", () => {
  const variableMap = { var1: "a" };
  const state = {
    path: [0],
    inputs: {},
    evaluations: [],
  };
  const environment = {};

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    require("../../files/state-file.service").__setState(state);
    require("../../files/environment-file.service").__setEnvironment(
      environment
    );
    require("../../../engine/services/engine").__setVariableMap(variableMap);
  });

  it("should print the variables of a workflow", async () => {
    await vars("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printJson(variableMap));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for a workflow name if none is given", async () => {
    await vars(undefined);
    expect(logSpy).toHaveBeenCalledWith(printJson(variableMap));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
