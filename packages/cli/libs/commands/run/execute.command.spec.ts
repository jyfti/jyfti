/* eslint-disable @typescript-eslint/no-explicit-any */
import { execute } from "./execute.command";
import { Workflow } from "@jyfti/engine";

jest.mock("../../data-access/workflow.dao", () => ({
  readWorkflowOrTerminate: () => Promise.resolve("my-workflow"),
  readWorkflowNamesOrTerminate: () => Promise.resolve(["my-workflow"]),
}));
jest.mock("../../data-access/config.dao");
jest.mock("../../data-access/schema.dao", () => ({
  readWorkflowSchemaOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../data-access/state.dao", () => ({
  readStateOrTerminate: () =>
    Promise.resolve({
      path: [0],
      inputs: {},
      evaluations: [],
    }),
}));
jest.mock("../../data-access/environment.dao", () => ({
  readEnvironmentOrTerminate: () => Promise.resolve({}),
}));
jest.mock("../../validator", () => ({
  validateInputsOrTerminate: () => Promise.resolve(),
  validateWorkflowOrTerminate: () => Promise.resolve(),
  validateEnvironmentOrTerminate: () => Promise.resolve(),
}));
jest.mock("../../inquirer.service", () => ({
  promptWorkflow: jest.fn(() => Promise.resolve("my-workflow")),
  promptWorkflowInputs: (workflow: Workflow) =>
    Promise.resolve(
      Object.keys(workflow.inputs || {}).map((_in, i) => "my-input-" + i)
    ),
}));
jest.mock("../../cli-engine", () => ({
  initAndRunToCompletion: jest.fn(() => Promise.resolve()),
}));

describe("the execute command", () => {
  it("should prompt for workflow name and continue", async () => {
    require("../../cli-engine").initAndRunToCompletion.mockReturnValue(
      Promise.resolve()
    );
    await execute(undefined);
    expect(
      require("../../inquirer.service").promptWorkflow
    ).toHaveBeenCalledWith(
      ["my-workflow"],
      "Which workflow do you want to start?"
    );
    expect(
      require("../../cli-engine").initAndRunToCompletion
    ).toHaveBeenCalledTimes(1);
  });
});
