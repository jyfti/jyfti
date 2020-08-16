import * as fs from "fs";
import * as nodePath from "path";
import { Config } from "../types/config";
import { Workflow, JsonSchema } from "../../engine/types";
import { readJson, fileExists } from "./file.service";
import chalk from "chalk";

export function resolveWorkflow(config: Config, name: string) {
  return nodePath.resolve(config.sourceRoot, name + ".json");
}

export async function readWorkflowNames(config: Config): Promise<string[]> {
  const fileNames = await fs.promises.readdir(config.sourceRoot);
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

export function workflowExists(config: Config, name: string): Promise<boolean> {
  return fileExists(resolveWorkflow(config, name));
}

export function writeWorkflow(
  config: Config,
  name: string,
  workflow: Workflow
): Promise<any> {
  const data = JSON.stringify(workflow, null, 2);
  return fs.promises.writeFile(resolveWorkflow(config, name), data, "utf8");
}
