import { Config } from "./types/config";
import { Workflow, JsonSchema } from "@jyfti/engine";
import { validate } from "@jyfti/engine";
import { printValidationErrors, printError } from "./print.service";
import { workflowExists, writeWorkflow } from "./files/workflow-file.service";
import { promptOverwriteDecision } from "./inquirer.service";

export async function install(
  config: Config,
  workflow: Workflow,
  schema: JsonSchema,
  name: string,
  overwrite: boolean
): Promise<void> {
  const errors = validate(workflow, schema);
  if (errors.length !== 0) {
    console.error(printError("The workflow is not valid."));
    console.error(printValidationErrors(errors));
    process.exitCode = 1;
    return;
  }
  const exists = await workflowExists(config, name);
  const write = !exists || overwrite || (await promptOverwriteDecision());
  if (write) {
    await writeWorkflow(config, name, workflow);
    console.log("Successfully saved.");
  } else {
    console.log("The workflow has not been saved.");
  }
}
