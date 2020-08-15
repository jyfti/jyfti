import * as fs from "fs";
import * as nodePath from "path";
import { JiftConfig } from "./types/jift-config";

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
  return readJson("jift.json").catch((err) => defaultJiftConfig);
}

export function readWorkflow(
  jiftConfig: JiftConfig,
  name: string
): Promise<any> {
  return readJson(resolveWorkflow(jiftConfig, name));
}

export function readState(jiftConfig: JiftConfig, name: string): Promise<any> {
  return readJson(resolveState(jiftConfig, name));
}
