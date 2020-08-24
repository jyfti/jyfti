import {
  readWorkflowNames,
  readWorkflowSchema,
  readWorkflow,
} from "./files/workflow-file.service";
import { validate } from "@jyfti/engine";
import { Config } from "./types/config";

describe("the validation of workflows", () => {
  const config: Config = {
    sourceRoot: "../../workflows",
    envRoot: "",
    outRoot: "",
  };

  it("should validate all provided workflows without errors", async () => {
    const schema = await readWorkflowSchema();
    const names = await readWorkflowNames(config);
    const workflows = await Promise.all(
      names.map((name) => readWorkflow(config, name))
    );
    workflows.forEach((workflow) => {
      expect(validate(workflow, schema)).toEqual([]);
    });
  });
});
