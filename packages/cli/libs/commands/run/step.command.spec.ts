/* eslint-disable @typescript-eslint/no-explicit-any */
import { step } from "./step.command";

jest.mock("../../data-access/workflow.dao", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/state.dao", () => ({
  readStateOrTerminate: () => Promise.resolve({}),
  writeState: jest.fn(() => Promise.resolve()),
}));
jest.mock("../../data-access/environment.dao", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../validator", () => ({
  validateEnvironmentOrTerminate: () => Promise.resolve(),
}));
jest.mock("../../inquirer.service", () => ({
  promptWorkflow: jest.fn(() => Promise.resolve("my-workflow")),
}));
jest.mock("../../cli-engine", () => ({
  runStep: jest.fn(() => Promise.resolve(true)),
}));

describe("the step command", () => {
  it("should prompt for workflow name and continue", async () => {
    const runStep = require("../../cli-engine").runStep;
    runStep.mockReturnValue(Promise.resolve(true));
    await step(undefined);
    expect(
      require("../../inquirer.service").promptWorkflow
    ).toHaveBeenCalledWith(
      ["my-workflow"],
      "Which workflow do you want to progress?"
    );
    expect(runStep).toHaveBeenCalledTimes(1);
  });
});
