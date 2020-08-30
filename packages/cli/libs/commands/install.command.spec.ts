/* eslint-disable @typescript-eslint/no-explicit-any */
import { install } from "./install.command";

jest.mock("../data-access/config.dao");
jest.mock("../data-access/workflow.dao", () => ({
  readWorkflowUrlOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../data-access/schema.dao", () => ({
  readWorkflowSchemaOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../install.service", () => ({
  install: jest.fn(() => Promise.resolve()),
}));

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
    expect(require("../install.service").install).toHaveBeenCalledTimes(1);
  });
});
