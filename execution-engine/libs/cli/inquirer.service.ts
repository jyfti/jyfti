import { JiftConfig } from "./types/jift-config";
import { readWorkflowNames } from "./file.service";
import inquirer from "inquirer";

export async function promptWorkflow(
  jiftConfig: JiftConfig,
  actionText: string
): Promise<string | undefined> {
  const workflowNames = await readWorkflowNames(jiftConfig);
  const answers = await inquirer.prompt([
    {
      name: "workflow",
      message: `Which workflow do you want to ${actionText}?`,
      type: "list",
      choices: workflowNames,
    },
  ]);
  return answers.workflow;
}
