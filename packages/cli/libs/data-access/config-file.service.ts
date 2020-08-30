import { Config } from "../types/config";
import { readJson, ensureDirExists, writeJson } from "./file.service";

export const configName = "jyfti.json";

export const defaultConfig: Config = {
  sourceRoot: "./src",
  outRoot: "./out",
  envRoot: "./environments",
  schemaLocation:
    "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
};

export async function readConfig(): Promise<Config> {
  const config = await readJson(configName).catch(() => ({}));
  if (!isPartialConfig(config)) {
    return Promise.reject("The config file is not a valid config");
  }
  const configWithDefaults: Config = { ...defaultConfig, ...config };
  await ensureDirExists(configWithDefaults.outRoot);
  await ensureDirExists(configWithDefaults.envRoot);
  await ensureDirExists(configWithDefaults.sourceRoot);
  return configWithDefaults;
}

export function writeConfig(config: Config): Promise<void> {
  return writeJson(configName, config);
}

function isPartialConfig(object: unknown): object is Partial<Config> {
  return typeof object === "object";
}
