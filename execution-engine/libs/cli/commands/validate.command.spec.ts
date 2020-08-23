import { validate } from "./validate.command";

jest.mock("../files/config-file.service");

describe("the validate command", () => {
  let mockExit: any;
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should disallow --all and a name to be set", async () => {
    await validate("my-workflow", { all: true });
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalled();
  });
});
