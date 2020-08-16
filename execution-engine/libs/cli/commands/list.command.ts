import { readJiftConfig, readWorkflowNames } from "../files/file.service";

export async function list() {
  const jiftConfig = await readJiftConfig();
  const workflowNames = await readWorkflowNames(jiftConfig);
  console.log(workflowNames.join("\n"));
}
