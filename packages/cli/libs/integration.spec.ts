/* eslint-disable @typescript-eslint/no-explicit-any */
import mock from "mock-fs";
import { createProgram } from "./program";
import { configName } from "./data-access/config.dao";
import { fileExists } from "./data-access/file.service";
import {
  printValue,
  printSuccess,
  printJson,
  printStepResult,
} from "./print.service";
import logSymbols from "log-symbols";

jest.mock("inquirer", () => ({
  prompt: jest.fn((questions: { name: string; default: string }[]) =>
    Promise.resolve(
      questions.reduce(
        (acc, question) => ({ ...acc, [question.name]: question.default }),
        {}
      )
    )
  ),
}));

describe("the commands in combination with each other", () => {
  const retrieveReadmeUrl =
    "https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/retrieve-readme.json";

  const command = (str: string) => ["node", "index.js"].concat(str.split(" "));

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    mock({});
  });

  afterEach(() => {
    mock.restore();
  });

  it("should not have a config at the beginning", async () => {
    expect(await fileExists(configName)).toBeFalsy();
  });

  it("should initialize a Jyfti project", async () => {
    const program = createProgram();

    await program.parseAsync(command("init"));
    expect(await fileExists(configName)).toBeTruthy();
    expect(logSpy).lastCalledWith("Initialized Jyfti project.");

    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should run a workflow outside of a Jyfti project", async () => {
    const program = createProgram();

    await program.parseAsync(command(`run ${retrieveReadmeUrl}`));
    expect(logSpy).toHaveBeenCalledTimes(3);

    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should install a workflow", async () => {
    const program = createProgram();

    await program.parseAsync(command("init"));
    expect(logSpy).lastCalledWith("Initialized Jyfti project.");

    await program.parseAsync(command(`install ${retrieveReadmeUrl}`));
    expect(logSpy).lastCalledWith("Successfully saved.");
    expect(await fileExists("./src/retrieve-readme.json")).toBeTruthy();

    await program.parseAsync(command(`view retrieve-readme`));

    await program.parseAsync(command("list"));
    expect(logSpy).lastCalledWith("retrieve-readme");

    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should run an installed workflow", async () => {
    const program = createProgram();

    await program.parseAsync(command("init"));
    expect(logSpy).lastCalledWith("Initialized Jyfti project.");

    await program.parseAsync(command(`install ${retrieveReadmeUrl}`));
    expect(logSpy).lastCalledWith("Successfully saved.");
    expect(await fileExists("./src/retrieve-readme.json")).toBeTruthy();

    await program.parseAsync(command("run retrieve-readme"));
    expect(await fileExists("./out/retrieve-readme.state.json")).toBeTruthy();

    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should run a workflow step-by-step", async () => {
    const program = createProgram();

    await program.parseAsync(command("init"));

    await program.parseAsync(command(`install ${retrieveReadmeUrl}`));

    await program.parseAsync(command("run status retrieve-readme"));
    expect(logSpy).lastCalledWith(printValue("[Not running]"));

    await program.parseAsync(command("run create retrieve-readme"));
    expect(logSpy).lastCalledWith(logSymbols.success + " Initialized");
    expect(await fileExists("./out/retrieve-readme.state.json")).toBeTruthy();

    await program.parseAsync(command("run status retrieve-readme"));
    expect(logSpy).lastCalledWith(
      printValue("[Pending]") + " At step " + printValue("[0]")
    );

    await program.parseAsync(command("run vars retrieve-readme"));
    expect(logSpy).lastCalledWith(
      printJson({ inputs: { org: "jyfti", repo: "jyfti" }, env: {} })
    );

    await program.parseAsync(command("run state retrieve-readme"));
    expect(logSpy).lastCalledWith(
      printJson({
        path: [0],
        inputs: { org: "jyfti", repo: "jyfti" },
        evaluations: [],
      })
    );

    await program.parseAsync(command("run step retrieve-readme"));
    expect(logSpy).lastCalledWith(
      printStepResult({
        path: [0],
        evaluation: null,
        name: "Retrieve README.md",
      })
    );

    await program.parseAsync(command("run status retrieve-readme"));
    expect(logSpy).lastCalledWith(printSuccess("[Completed]"));

    await program.parseAsync(command("run step retrieve-readme"));
    expect(logSpy).lastCalledWith("Workflow execution already completed");

    await program.parseAsync(command("run reset retrieve-readme"));

    await program.parseAsync(command("run status retrieve-readme"));
    expect(logSpy).lastCalledWith(printValue("[Not running]"));

    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
