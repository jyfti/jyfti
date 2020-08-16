import * as fs from "fs";
import * as nodePath from "path";
import { JiftConfig } from "../types/jift-config";
import { Workflow } from "../../engine/types";
import { readJson, fileExists } from "./file.service";

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

export function readWorkflowSchema(): Promise<Workflow> {
  // TODO Make flexible
  return readJson("../workflow-schema.json");
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
