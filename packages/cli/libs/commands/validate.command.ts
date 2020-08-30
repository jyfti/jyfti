import { readConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { validateWorkflow } from "@jyfti/engine";
import { printValidationErrors, printValue } from "../print.service";
import {
  readWorkflowNamesOrTerminate,
  readWorkflowOrTerminate,
} from "../files/workflow-file.service";
import { readWorkflowSchemaOrTerminate } from "../files/workflow-schema.service";
import { Config } from "../types/config";

export async function validate(
  name?: string,
  cmd?: { all?: boolean }
): Promise<void> {
  const config = await readConfig();
  if (name && cmd?.all) {
    console.error("Only of [name] and option --all can be specified at once.");
    process.exitCode = 1;
    return;
  }
  const names = await determineNames(config, name, cmd?.all);
  const schema = await readWorkflowSchemaOrTerminate(config);
  const workflows = await Promise.all(
    names
      .filter((name) => name)
      .map(async (name) => ({
        name,
        workflow: await readWorkflowOrTerminate(config, name),
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
    process.exitCode = 1;
  }
}

async function determineNames(
  config: Config,
  name?: string,
  all?: boolean
): Promise<string[]> {
  if (name) {
    return [name];
  }
  const names = await readWorkflowNamesOrTerminate(config);
  return all
    ? names
    : asList(
        await promptWorkflow(names, "Which workflow do you want to validate?")
      );
}

function asList<T>(value: T | undefined): T[] {
  return value ? [value] : [];
}
