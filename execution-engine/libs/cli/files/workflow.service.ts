import { Config } from "../types/config";
import { Workflow } from "../../engine/types";
import * as http from "./workflow-http.service";
import * as file from "./workflow-file.service";

export function isUrl(name: string): boolean {
  return name.startsWith("http://") || name.startsWith("https://");
}

export function extractWorkflowName(name: string): string {
  return isUrl(name) ? http.extractWorkflowName(name) : name;
}

export function readWorkflowOrTerminate(
  config: Config,
  name: string
): Promise<Workflow> {
  const readWorkflowOrTerminate = isUrl(name)
    ? http.readWorkflowOrTerminate
    : file.readWorkflowOrTerminate;
  return readWorkflowOrTerminate(config, name);
}
