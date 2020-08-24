import { Config } from "../../types/config";

export const configName: string = "jyfti.json";

export const defaultConfig: Config = {
  sourceRoot: "./src",
  outRoot: "./out",
  envRoot: "./environments",
};

export async function readConfig(): Promise<Config> {
  return Promise.resolve(defaultConfig);
}

export function writeConfig(): Promise<void> {
  return Promise.resolve();
}
