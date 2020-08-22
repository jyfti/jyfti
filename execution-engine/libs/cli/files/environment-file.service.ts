import { VariableMap } from "libs/engine/types";
import { readJson, fileExists } from "./file.service";
import { Config } from "../types/config";
import * as nodePath from "path";
import * as fs from "fs";
import chalk from "chalk";

export const defaultEnvironmentName: string = "default";

export function resolveEnvironment(config: Config, name: string) {
  return nodePath.resolve(config.envRoot, name + ".json");
}

function readEnvironment(
  config: Config,
  name: string | undefined
): Promise<VariableMap> {
  return readJson(resolveEnvironment(config, name || defaultEnvironmentName));
}

export function environmentExists(
  config: Config,
  name: string
): Promise<boolean> {
  return fileExists(resolveEnvironment(config, name));
}

export function writeEnvironment(
  config: Config,
  name: string,
  environment: VariableMap
): Promise<any> {
  const data = JSON.stringify(environment, null, 2);
  return fs.promises.writeFile(resolveEnvironment(config, name), data, "utf8");
}

export async function readEnvironmentOrTerminate(
  config: Config,
  name: string | undefined
): Promise<VariableMap> {
  const environment = await readEnvironment(config, name).catch(
    () => undefined
  );
  if (!environment) {
    console.error(chalk.red("Environment does not exist."));
    process.exit(1);
  }
  return environment;
}

export async function readEnvironmentNames(config: Config): Promise<string[]> {
  const fileNames = await fs.promises.readdir(config.envRoot);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.substring(0, fileName.length - ".json".length));
}
