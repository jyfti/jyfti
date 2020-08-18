import { readConfig } from "../files/config-file.service";

import {
  writeWorkflow,
  readWorkflowSchemaOrTerminate,
  workflowExists,
} from "../files/workflow-file.service";
import { validateWorkflow } from "../../engine/services/validator.service";
import { printValidationErrors } from "../print.service";
import chalk from "chalk";
import inquirer from "inquirer";
import { readWorkflowOrTerminate } from "../files/workflow-http.service";

export async function install(url: string, name?: string, cmd?: any) {
  const config = await readConfig();
  const schema = await readWorkflowSchemaOrTerminate();
  const workflow = await readWorkflowOrTerminate(config, url);
  if (workflow) {
    const errors = validateWorkflow(workflow, schema);
    if (errors.length !== 0) {
      console.error(chalk.red("The workflow is not valid."));
      console.error(printValidationErrors(errors));
      process.exit(1);
    }
    name = name || extractWorkflowName(url);
    const exists = await workflowExists(config, name);
    const write = !exists || cmd?.yes || (await promptOverwriteDecision());
    if (write) {
      await writeWorkflow(config, name, workflow);
      console.log("Successfully saved.");
    } else {
      console.log("The workflow has not been saved.");
    }
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

function extractWorkflowName(url: string): string {
  const segments = new URL(url).pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  return lastSegment.endsWith(".json")
    ? lastSegment.substring(0, lastSegment.length - ".json".length)
    : lastSegment;
}
