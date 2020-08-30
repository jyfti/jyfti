import {
  promptName,
  promptWorkflow,
  promptWorkflowInputs,
} from "./inquirer.service";
import { Workflow } from "@jyfti/engine";

jest.mock("inquirer", () => ({
  prompt: jest.fn(() => Promise.resolve({})),
}));

describe("the inquirer service", () => {
  it("inquires a name of an entity from the user", async () => {
    require("inquirer").prompt.mockReturnValue({ name: "my-entity" });
    expect(await promptName("entity-type")).toEqual("my-entity");
  });

  it("inquires a workflow name from a list of names from the user", async () => {
    require("inquirer").prompt.mockReturnValue({ workflow: "my-workflow" });
    expect(
      await promptWorkflow(["my-workflow", "my-other-workflow"], "Which?")
    ).toEqual("my-workflow");
  });

  it("inquires a value for each input of a workflow", async () => {
    const workflow: Workflow = {
      name: "My Workflow",
      inputs: {
        a: {
          type: "string",
        },
        b: {
          type: "number",
        },
      },
      steps: [],
    };
    require("inquirer").prompt.mockReturnValue({
      b: "13",
      a: "my-value",
    });
    expect(await promptWorkflowInputs(workflow)).toEqual(["my-value", "13"]);
  });
});
