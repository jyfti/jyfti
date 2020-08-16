import * as fs from "fs";
import { Config } from "../types/config";
import { readJson } from "./file.service";

export const configName: string = "jyfti.json";

export const defaultConfig: Config = {
  sourceRoot: "./src",
  outRoot: "./out",
};

export function readConfig(): Promise<Config> {
  return readJson(configName).catch(() => defaultConfig);
}

export function writeConfig(config: Config): Promise<any> {
  const data = JSON.stringify(config, null, 2);
  return fs.promises.writeFile(configName, data, "utf8");
}
