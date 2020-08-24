import { reset } from "./reset.command";

jest.mock("../../files/config-file.service");
jest.mock("../../files/state-file.service");
jest.mock("../../inquirer.service");

describe("the reset command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should delete the state of a workflow", async () => {
    await reset("my-workflow");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should prompt for a workflow name if none is given", async () => {
    await reset(undefined);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
