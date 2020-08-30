import { readConfig } from "../data-access/config-file.service";

import { readWorkflowSchemaOrTerminate } from "../data-access/workflow-schema.service";
import { readWorkflowUrlOrTerminate } from "../data-access/workflow-file.service";
import * as installer from "../install.service";
import { extractWorkflowName } from "../data-access/workflow.util";

export async function install(
  url: string,
  name?: string,
  cmd?: { yes?: boolean }
): Promise<void> {
  const config = await readConfig();
  const schema = await readWorkflowSchemaOrTerminate(config);
  const workflow = await readWorkflowUrlOrTerminate(config, url);
  if (workflow) {
    name = name || extractWorkflowName(url);
    await installer.install(config, workflow, schema, name, cmd?.yes || false);
  }
}
