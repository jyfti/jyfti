import { readJiftConfig } from "../files/config-file.service";
import { readWorkflowNames } from "../files/workflow-file.service";

export async function list() {
  const jiftConfig = await readJiftConfig();
  const workflowNames = await readWorkflowNames(jiftConfig);
  console.log(workflowNames.join("\n"));
}
