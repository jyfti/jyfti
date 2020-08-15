import * as fs from "fs";
import * as nodePath from "path";
import { JiftConfig } from "./types/jift-config";
import { State } from "libs/engine/types/state.type";
import { Workflow } from "libs/engine/types/workflow.type";

export function fileExists(path: string): Promise<boolean> {
  return fs.promises
    .stat(path)
    .then(() => true)
    .catch(() => false);
}

export async function ensureDirExists(path: string) {
  const exists = await fileExists(path);
  if (!exists) {
    await fs.promises.mkdir(path);
  }
}

export function readJson(path: string) {
  return fs.promises.readFile(path, "utf8").then(JSON.parse);
}

export const jiftConfigName: string = "jift.json";

export const defaultJiftConfig: JiftConfig = {
  sourceRoot: "./src",
  outRoot: "./out",
};

export function resolveWorkflow(jiftConfig: JiftConfig, name: string) {
  return nodePath.resolve(jiftConfig.sourceRoot, name + ".json");
}

export function resolveState(jiftConfig: JiftConfig, name: string) {
  return nodePath.resolve(jiftConfig.outRoot, name + ".state.json");
}

export function readJiftConfig(): Promise<JiftConfig> {
  return readJson(jiftConfigName).catch((err) => defaultJiftConfig);
}

export function writeJiftConfig(jiftConfig: JiftConfig): Promise<any> {
  const data = JSON.stringify(jiftConfig, null, 2);
  return fs.promises.writeFile(jiftConfigName, data, "utf8");
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

export function readState(
  jiftConfig: JiftConfig,
  name: string
): Promise<State> {
  return readJson(resolveState(jiftConfig, name));
}

export function writeState(
  jiftConfig: JiftConfig,
  name: string,
  state: State
): Promise<any> {
  const data = JSON.stringify(state, null, 2);
  return fs.promises.writeFile(resolveState(jiftConfig, name), data, "utf8");
}

export function deleteState(
  jiftConfig: JiftConfig,
  name: string
): Promise<any> {
  return fs.promises.unlink(resolveState(jiftConfig, name));
}

export async function deleteAllStates(jiftConfig: JiftConfig): Promise<any> {
  return fs.promises.rmdir(jiftConfig.outRoot, { recursive: true });
}
