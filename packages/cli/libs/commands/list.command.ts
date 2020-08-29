import { readConfig } from "../files/config-file.service";
import { readWorkflowNames } from "../files/workflow-file.service";

export async function list(): Promise<void> {
  const config = await readConfig();
  const workflowNames = await readWorkflowNames(config);
  console.log(workflowNames.join("\n"));
}
