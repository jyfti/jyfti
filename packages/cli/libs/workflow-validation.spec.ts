import { readWorkflowNames, readWorkflow } from "./data-access/workflow.dao";
import { validateWorkflow } from "@jyfti/engine";
import { Config } from "./types/config";
import { readWorkflowSchemaOrTerminate } from "./data-access/workflow-schema.service";

describe("the validation of workflows", () => {
  const config: Config = {
    sourceRoot: "../../workflows",
    envRoot: "",
    outRoot: "",
    schemaLocation: "../../workflow-schema.json",
  };

  it("should validate all provided workflows without errors", async () => {
    const schema = await readWorkflowSchemaOrTerminate(config);
    const names = await readWorkflowNames(config);
    const workflows = await Promise.all(
      names.map((name) => readWorkflow(config, name))
    );
    workflows.forEach((workflow) => {
      expect(validateWorkflow(workflow, schema)).toEqual([]);
    });
  });
});
