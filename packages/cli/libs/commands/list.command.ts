import { readConfig } from "../files/config-file.service";
import { readWorkflowNamesOrTerminate } from "../files/workflow-file.service";

export async function list(): Promise<void> {
  const config = await readConfig();
  const workflowNames = await readWorkflowNamesOrTerminate(config);
  console.log(workflowNames.join("\n"));
}
