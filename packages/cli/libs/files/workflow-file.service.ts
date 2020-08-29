import * as nodePath from "path";
import { Config } from "../types/config";
import { Workflow, JsonSchema } from "@jyfti/engine";
import { readJson, fileExists, writeJson, listDirFiles } from "./file.service";
import { printError } from "../print.service";

function resolveWorkflow(config: Config, name: string) {
  return nodePath.resolve(config.sourceRoot, name + ".json");
}

export async function readWorkflowNames(config: Config): Promise<string[]> {
  const fileNames = await listDirFiles(config.sourceRoot);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.substring(0, fileName.length - ".json".length));
}

export async function readWorkflow(
  config: Config,
  name: string
): Promise<Workflow> {
  const workflow = await readJson(resolveWorkflow(config, name));
  if (!isWorkflow(workflow)) {
    return Promise.reject(
      "The workflow file does not represent a valid workflow"
    );
  }
  return workflow;
}

function isWorkflow(object: unknown): object is Workflow {
  return typeof object === "object";
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

export async function readWorkflowSchema(): Promise<JsonSchema> {
  // TODO Make flexible
  const schema = await readJson("../../workflow-schema.json");
  if (!isWorkflowSchema(schema)) {
    return Promise.reject(
      "The workflow schema file does not represent a valid schema"
    );
  }
  return schema;
}

function isWorkflowSchema(object: unknown): object is JsonSchema {
  return typeof object === "object";
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
): Promise<void> {
  return writeJson(resolveWorkflow(config, name), workflow);
}
