import * as fs from "fs";
import * as nodePath from "path";
import { JiftConfig } from "../types/jift-config";
import { Workflow, JsonSchema } from "../../engine/types";
import { readJson, fileExists } from "./file.service";
import { join } from "path";
import chalk from "chalk";

export function resolveWorkflow(jiftConfig: JiftConfig, name: string) {
  return nodePath.resolve(jiftConfig.sourceRoot, name + ".json");
}

export async function readWorkflowNames(
  jiftConfig: JiftConfig
): Promise<string[]> {
  const fileNames = await fs.promises.readdir(jiftConfig.sourceRoot);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.substring(0, fileName.length - ".json".length));
}

export function readWorkflow(
  jiftConfig: JiftConfig,
  name: string
): Promise<Workflow> {
  return readJson(resolveWorkflow(jiftConfig, name));
}

export async function readWorkflowOrTerminate(
  jiftConfig: JiftConfig,
  name: string
): Promise<Workflow> {
  const workflow = await readWorkflow(jiftConfig, name).catch(() => undefined);
  if (!workflow) {
    console.error(chalk.red("Workflow does not exist."));
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
    console.error(chalk.red("Workflow schema can not be found."));
    process.exit(1);
  }
  return schema;
}

export function workflowExists(
  jiftConfig: JiftConfig,
  name: string
): Promise<boolean> {
  return fileExists(resolveWorkflow(jiftConfig, name));
}

export function writeWorkflow(
  jiftConfig: JiftConfig,
  name: string,
  workflow: Workflow
): Promise<any> {
  const data = JSON.stringify(workflow, null, 2);
  return fs.promises.writeFile(resolveWorkflow(jiftConfig, name), data, "utf8");
}
