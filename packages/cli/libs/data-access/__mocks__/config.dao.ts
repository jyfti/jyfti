import { Config } from "../../types/config";

export const configName = "jyfti.json";

export const defaultConfig: Config = {
  sourceRoot: "./tmp",
  outRoot: "./tmp",
  envRoot: "./tmp",
  schemaLocation: "./tmp/schema.json",
};

export async function readConfig(): Promise<Config> {
  return Promise.resolve(defaultConfig);
}

export function writeConfig(): Promise<void> {
  return Promise.resolve();
}
