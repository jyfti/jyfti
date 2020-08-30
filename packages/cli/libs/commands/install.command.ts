import { readConfig } from "../files/config-file.service";

import { readWorkflowSchemaOrTerminate } from "../files/workflow-schema.service";
import { readWorkflowUrlOrTerminate } from "../files/workflow-file.service";
import * as installer from "../install.service";
import { extractWorkflowName } from "../files/workflow.util";

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
