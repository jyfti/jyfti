import { Config } from "./types/config";
import { readWorkflowNames } from "./files/workflow-file.service";
import inquirer from "inquirer";
import { Workflow } from "../engine/types";
import { readEnvironmentNames } from "./files/environment-file.service";

export async function promptWorkflow(
  config: Config,
  question: string
): Promise<string | undefined> {
  const workflowNames = await readWorkflowNames(config);
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

export async function promptEnvironment(
  config: Config,
  question: string
): Promise<string | undefined> {
  const names = await readEnvironmentNames(config);
  const answers = await inquirer.prompt([
    {
      name: "environment",
      message: question,
      type: "list",
      choices: names,
    },
  ]);
  return answers.environment;
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
