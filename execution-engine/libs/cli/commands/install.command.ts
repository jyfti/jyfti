import { readConfig } from "../files/config-file.service";

import { readWorkflowSchemaOrTerminate } from "../files/workflow-file.service";
import { readWorkflowOrTerminate } from "../files/workflow-http.service";
import * as installer from "../install.service";
import { WorkflowService } from "../files/workflow.service";

export async function install(url: string, name?: string, cmd?: any) {
  const workflowService = new WorkflowService();
  const config = await readConfig();
  const schema = await readWorkflowSchemaOrTerminate();
  const workflow = await readWorkflowOrTerminate(config, url);
  if (workflow) {
    name = name || workflowService.extractWorkflowName(url);
    await installer.install(config, workflow, schema, name, cmd?.yes);
  }
}
