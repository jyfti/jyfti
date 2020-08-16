import * as fs from "fs";
import { JiftConfig } from "../types/jift-config";

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

export function readJiftConfig(): Promise<JiftConfig> {
  return readJson(jiftConfigName).catch((err) => defaultJiftConfig);
}

export function writeJiftConfig(jiftConfig: JiftConfig): Promise<any> {
  const data = JSON.stringify(jiftConfig, null, 2);
  return fs.promises.writeFile(jiftConfigName, data, "utf8");
}
