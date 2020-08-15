import { JiftConfig } from "./types/jift-config";
import { readWorkflowNames } from "./file.service";
import inquirer from "inquirer";
import { Workflow } from "libs/engine/types/workflow.type";

export async function promptWorkflow(
  jiftConfig: JiftConfig,
  question: string
): Promise<string | undefined> {
  const workflowNames = await readWorkflowNames(jiftConfig);
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
  // TODO This implicitly relies on a specific structure in the schema
  const answers = await inquirer.prompt(
    Object.keys(workflow.inputs).map((fieldName) => ({
      name: fieldName,
      message: workflow.inputs[fieldName]?.description,
      type: "string",
    }))
  );
  return Object.keys(workflow.inputs).map((fieldName) => answers[fieldName]);
}
