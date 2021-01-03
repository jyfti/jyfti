/* eslint-disable @typescript-eslint/no-explicit-any */
import { complete } from "./complete.command";

jest.mock("../../data-access/workflow.dao", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/state.dao", () => ({
  readStateOrTerminate: () =>
    Promise.resolve({
      path: [0],
      inputs: {},
      evaluations: [],
    }),
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
  runToCompletion: jest.fn(() => Promise.resolve()),
}));

describe("the complete command", () => {
  it("should prompt for workflow name and continue", async () => {
    const runToCompletion = require("../../cli-engine").runToCompletion;
    runToCompletion.mockReturnValue(Promise.resolve());
    await complete(undefined);
    expect(
      require("../../inquirer.service").promptWorkflow
    ).toHaveBeenCalledWith(
      ["my-workflow"],
      "Which workflow do you want to complete?"
    );
    expect(runToCompletion).toHaveBeenCalledTimes(1);
  });
});
