import { JiftConfig } from "./types/jift-config";
import { readWorkflowNames } from "./file.service";
import inquirer from "inquirer";

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
