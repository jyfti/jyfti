import * as nodePath from "path";
import { Config } from "../types/config";
import { Workflow, JsonSchema } from "../../engine/types";
import { readJson, fileExists, writeJson, listDirFiles } from "./file.service";
import { printError } from "../print.service";

export function resolveWorkflow(config: Config, name: string) {
  return nodePath.resolve(config.sourceRoot, name + ".json");
}

export async function readWorkflowNames(config: Config): Promise<string[]> {
  const fileNames = await listDirFiles(config.sourceRoot);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.substring(0, fileName.length - ".json".length));
}

export function readWorkflow(config: Config, name: string): Promise<Workflow> {
  return readJson(resolveWorkflow(config, name));
}

export async function readWorkflowOrTerminate(
  config: Config,
  name: string
): Promise<Workflow> {
  const workflow = await readWorkflow(config, name).catch(() => undefined);
  if (!workflow) {
    console.error(printError("Workflow does not exist."));
    process.exit(1);
  }
  return workflow;
}

export function readWorkflowSchema(): Promise<JsonSchema> {
  // TODO Make flexible
  return readJson("../workflow-schema.json");
}

export async function readWorkflowSchemaOrTerminate(): Promise<JsonSchema> {
  const schema = await readWorkflowSchema().catch(() => undefined);
  if (!schema) {
    console.error(printError("Workflow schema can not be found."));
    process.exit(1);
  }
  return schema;
}

export function workflowExists(config: Config, name: string): Promise<boolean> {
  return fileExists(resolveWorkflow(config, name));
}

export function writeWorkflow(
  config: Config,
  name: string,
  workflow: Workflow
): Promise<any> {
  return writeJson(resolveWorkflow(config, name), workflow);
}
