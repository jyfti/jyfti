import { validate } from "./validate.command";

jest.mock("../files/config-file.service");

describe("the validate command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should disallow --all and a name to be set", async () => {
    await validate("my-workflow", { all: true });
    expect(process.exitCode).toEqual(1);
    expect(errorSpy).toHaveBeenCalled();
  });
});
