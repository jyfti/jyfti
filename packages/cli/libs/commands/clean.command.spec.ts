/* eslint-disable @typescript-eslint/no-explicit-any */
import { clean } from "./clean.command";

jest.mock("../data-access/config.dao");
jest.mock("../data-access/state-file.service");

describe("the clean command", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should delete all states of all workflows", async () => {
    await clean();
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
