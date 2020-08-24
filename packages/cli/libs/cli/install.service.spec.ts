import { install } from "./install.service";
import { Config } from "./types/config";
import { Workflow, JsonSchema } from "@jyfti/engine";
import { printError } from "./print.service";

jest.mock("./files/workflow-file.service");
jest.mock("../engine/services/validator");
jest.mock("./inquirer.service");

describe("the installation of a workflow", () => {
  const config: Config = {
    sourceRoot: "./",
    envRoot: "./",
    outRoot: "./",
  };
  const workflow: Workflow = {
    name: "my-workflow",
    steps: [],
  };
  const schema: JsonSchema = {};

  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.exitCode = 0;
  });

  it("should fail if the workflow has errors", async () => {
    require("../engine/services/validator").__setResponse(false);
    await install(config, workflow, schema, "my-workflow", true);
    expect(logSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledWith(
      printError("The workflow is not valid.")
    );
    expect(process.exitCode).toEqual(1);
  });

  it("should overwrite an existing workflow if --yes is set", async () => {
    require("../engine/services/validator").__setResponse(true);
    require("./inquirer.service").__setReturnsContent(true);
    await install(config, workflow, schema, "my-workflow", true);
    expect(logSpy).toHaveBeenCalledWith("Successfully saved.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should overwrite an existing workflow if the user answers yes on the prompt", async () => {
    require("../engine/services/validator").__setResponse(true);
    require("./inquirer.service").__setReturnsContent(true);
    await install(config, workflow, schema, "my-workflow", false);
    expect(logSpy).toHaveBeenCalledWith("Successfully saved.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it("should not overwrite an existing workflow if the user answers no on the prompt", async () => {
    require("../engine/services/validator").__setResponse(true);
    require("./inquirer.service").__setReturnsContent(false);
    await install(config, workflow, schema, "my-workflow", false);
    expect(logSpy).toHaveBeenCalledWith("The workflow has not been saved.");
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });
});
