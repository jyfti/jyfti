import { readConfig } from "../files/config-file.service";

import { readWorkflowSchemaOrTerminate } from "../files/workflow-file.service";
import { readWorkflowOrTerminate } from "../files/workflow-http.service";
import * as installer from "../install.service";
import { extractWorkflowName } from "../files/workflow.util";

export async function install(
  url: string,
  name?: string,
  cmd?: { yes?: boolean }
): Promise<void> {
  const config = await readConfig();
  const schema = await readWorkflowSchemaOrTerminate();
  const workflow = await readWorkflowOrTerminate(config, url);
  if (workflow) {
    name = name || extractWorkflowName(url);
    await installer.install(config, workflow, schema, name, cmd?.yes || false);
  }
}
