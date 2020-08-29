import { Config } from "./types/config";
import { readWorkflowNamesOrTerminate } from "./files/workflow-file.service";
import inquirer from "inquirer";
import { Workflow } from "@jyfti/engine";
import { readEnvironmentNames } from "./files/environment-file.service";

export async function promptName(entity: string): Promise<string> {
  const answers = await inquirer.prompt([
    {
      name: "name",
      message: `What shall be the name of the ${entity}?`,
      type: "string",
      default: "default",
    },
  ]);
  return answers.name;
}

export async function promptWorkflow(
  config: Config,
  question: string
): Promise<string | undefined> {
  const workflowNames = await readWorkflowNamesOrTerminate(config);
  const answers = await inquirer.prompt([
    {
      name: "workflow",
      message: question,
      type: "list",
      choices: workflowNames,
    },
  ]);
  return answers.workflow;
}

export async function promptWorkflowInputs(
  workflow: Workflow
): Promise<string[]> {
  const inputs = workflow?.inputs || {};
  // TODO This implicitly relies on a specific structure in the schema
  const answers = await inquirer.prompt(
    Object.keys(inputs).map((fieldName) => ({
      name: fieldName,
      message: inputs[fieldName]?.description,
      type: "string",
      default: inputs[fieldName]?.default,
    }))
  );
  return Object.keys(inputs).map((fieldName) => answers[fieldName]);
}

export async function promptOverwriteDecision(): Promise<boolean> {
  const answers = await inquirer.prompt({
    name: "yes",
    message: "Do you want to overwrite the existing workflow?",
    type: "confirm",
    default: false,
  });
  return answers.yes;
}
