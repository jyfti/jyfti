import { Config } from "../types/config";
import { readJson, ensureDirExists, writeJson } from "./file.service";

export const configName: string = "jyfti.json";

export const defaultConfig: Config = {
  sourceRoot: "./src",
  outRoot: "./out",
  envRoot: "./environments",
};

export async function readConfig(): Promise<Config> {
  const config = await readJson(configName).catch(() => defaultConfig);
  await ensureDirExists(config.outRoot);
  await ensureDirExists(config.envRoot);
  return config;
}

export function writeConfig(config: Config): Promise<void> {
  return writeJson(configName, config);
}
