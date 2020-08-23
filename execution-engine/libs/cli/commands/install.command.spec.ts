import { install } from "./install.command";

jest.mock("../files/config-file.service");
jest.mock("../files/workflow-http.service");
jest.mock("../install.service");

describe("the install command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should install a workflow", async () => {
    await install("http://localhost:8080/group/my-workflow");
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
