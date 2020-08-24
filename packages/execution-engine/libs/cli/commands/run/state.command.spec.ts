import { state } from "./state.command";
import { printJson } from "../../print.service";

jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service");
jest.mock("../../inquirer.service");

describe("the state command", () => {
  const stateObject = {
    path: [0],
    inputs: {},
    evaluations: [],
  };

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    require("../../files/state-file.service").__setState(stateObject);
  });

  it("should print the state of a workflow", async () => {
    await state("my-workflow");
    expect(logSpy).toHaveBeenCalledWith(printJson(stateObject));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for a workflow name if none is given", async () => {
    await state(undefined);
    expect(logSpy).toHaveBeenCalledWith(printJson(stateObject));
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
