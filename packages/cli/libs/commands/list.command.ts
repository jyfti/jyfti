import { readConfig } from "../data-access/config.dao";
import { readWorkflowNamesOrTerminate } from "../data-access/workflow-file.service";

export async function list(): Promise<void> {
  const config = await readConfig();
  const workflowNames = await readWorkflowNamesOrTerminate(config);
  console.log(workflowNames.join("\n"));
}
