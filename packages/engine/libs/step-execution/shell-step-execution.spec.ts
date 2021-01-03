/* eslint-disable @typescript-eslint/no-var-requires */
import { cold } from "jest-marbles";
import { executeShellStep } from "./shell-step-execution";

jest.mock("child_process", () => ({
  exec: jest.fn(() => {
    return;
  }),
}));

describe("a shell step", () => {
  it("should evaluate a command", (done) => {
    require("child_process").exec.mockImplementation(
      (_command, _options, callback) => {
        callback(undefined, "stdout", undefined);
      }
    );
    executeShellStep("ls", {}, "").subscribe(
      (result) => expect(result).toEqual("stdout"),
      fail,
      done
    );
  });

  it("should throw an error if the command expression can't be evaluated", () => {
    expect(executeShellStep("${someVar}", { someVar: {} }, "")).toBeObservable(
      cold("#")
    );
  });

  it("should throw an error if the command yields any stderr", (done) => {
    require("child_process").exec.mockImplementation(
      (_command, _options, callback) => {
        callback(undefined, "stdout", "stderr");
      }
    );
    executeShellStep("ls", {}, "").subscribe(
      fail,
      (err) => {
        expect(err).toEqual("stderr");
        done();
      },
      fail
    );
  });

  it("should throw an error if the command execution fails", (done) => {
    require("child_process").exec.mockImplementation(
      (_command, _options, callback) => {
        callback({ code: 1 }, "stdout", undefined);
      }
    );
    executeShellStep("ls", {}, "").subscribe(
      fail,
      (err) => {
        expect(err).toEqual({ code: 1 });
        done();
      },
      fail
    );
  });
});
