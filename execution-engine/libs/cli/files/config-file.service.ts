import * as fs from "fs";
import { JiftConfig } from "../types/jift-config";
import { readJson } from "./file.service";

export const jiftConfigName: string = "jift.json";

export const defaultJiftConfig: JiftConfig = {
  sourceRoot: "./src",
  outRoot: "./out",
};

export function readJiftConfig(): Promise<JiftConfig> {
  return readJson(jiftConfigName).catch(() => defaultJiftConfig);
}

export function writeJiftConfig(jiftConfig: JiftConfig): Promise<any> {
  const data = JSON.stringify(jiftConfig, null, 2);
  return fs.promises.writeFile(jiftConfigName, data, "utf8");
}
