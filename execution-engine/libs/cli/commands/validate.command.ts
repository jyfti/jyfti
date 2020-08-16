import { readJiftConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { validateWorkflow } from "../../engine/services/validator.service";
import { printValidationErrors } from "../print.service";
import {
  readWorkflowOrTerminate,
  readWorkflowSchemaOrTerminate,
} from "../files/workflow-file.service";

export async function validate(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to validate?"
    );
  }
  if (name) {
    const schema = await readWorkflowSchemaOrTerminate();
    const workflow = await readWorkflowOrTerminate(jiftConfig, name);
    const errors = validateWorkflow(workflow, schema);
    if (errors.length != 0) {
      console.log(printValidationErrors(errors));
      process.exit(1);
    }
  }
}
