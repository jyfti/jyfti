import { createInputs, extractWorkflowName } from "./workflow.util";

describe("workflow utility functions", () => {
  it("extracts a workflow name from a url", () => {
    expect(
      extractWorkflowName("https://localhost:8080/group/my-workflow.json")
    ).toEqual("my-workflow");
  });

  it("create inputs from a list", () => {
    expect(
      createInputs(
        {
          name: "MyWorkflow",
          inputs: { a: { type: "string" }, b: { type: "string" } },
          steps: [],
        },
        ["value1", "value2"]
      )
    ).toEqual({ a: "value1", b: "value2" });
  });
});
