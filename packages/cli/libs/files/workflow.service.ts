import { Config } from "../types/config";
import { Workflow } from "@jyfti/engine";
import * as http from "./workflow-http.service";
import * as file from "./workflow-file.service";
import { isUrl } from "./workflow.util";

export function readWorkflowOrTerminate(
  config: Config,
  name: string
): Promise<Workflow> {
  const readWorkflowOrTerminate = isUrl(name)
    ? http.readWorkflowOrTerminate
    : file.readWorkflowOrTerminate;
  return readWorkflowOrTerminate(config, name);
}
