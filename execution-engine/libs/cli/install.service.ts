import { Config } from "./types/config";
import { Workflow, JsonSchema } from "libs/engine/types";
import { validateWorkflow } from "../engine/services/validator.service";
import chalk from "chalk";
import { printValidationErrors } from "./print.service";
import { workflowExists, writeWorkflow } from "./files/workflow-file.service";
import inquirer from "inquirer";

export async function install(
  config: Config,
  workflow: Workflow,
  schema: JsonSchema,
  name: string,
  overwrite: boolean
) {
  const errors = validateWorkflow(workflow, schema);
  if (errors.length !== 0) {
    console.error(chalk.red("The workflow is not valid."));
    console.error(printValidationErrors(errors));
    process.exit(1);
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

async function promptOverwriteDecision(): Promise<boolean> {
  const answers = await inquirer.prompt({
    name: "yes",
    message: "Do you want to overwrite the existing workflow?",
    type: "confirm",
    default: false,
  });
  return answers.yes;
}
