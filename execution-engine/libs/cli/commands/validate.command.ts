import { readConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { validateWorkflow } from "../../engine/services/validator";
import { printValidationErrors, printValue } from "../print.service";
import {
  readWorkflowOrTerminate,
  readWorkflowSchemaOrTerminate,
  readWorkflowNames,
} from "../files/workflow-file.service";

export async function validate(name?: string, cmd?: any) {
  const config = await readConfig();
  if (name && cmd?.all) {
    console.error("Only of [name] and option --all can be specified at once.");
    process.exit(1);
  }
  const names = name
    ? [name]
    : cmd?.all
    ? await readWorkflowNames(config)
    : [await promptWorkflow(config, "Which workflow do you want to validate?")];
  const schema = await readWorkflowSchemaOrTerminate();
  const workflows = await Promise.all(
    names
      .filter((name) => name)
      .map(async (name) => ({
        name,
        workflow: await readWorkflowOrTerminate(config, name!),
      }))
  );
  const allErrorMessages = workflows
    .map(({ name, workflow }) => ({
      name,
      errors: validateWorkflow(workflow, schema),
    }))
    .filter(({ errors }) => errors.length !== 0)
    .map(
      ({ name, errors }) =>
        "In " + printValue(name) + ":\n" + printValidationErrors(errors)
    );
  if (allErrorMessages.length !== 0) {
    console.log(allErrorMessages.join("\n\n"));
    process.exit(1);
  }
}
