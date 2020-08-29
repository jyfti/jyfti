import { Environment } from "@jyfti/engine";
import { readJson, fileExists, writeJson, listDirFiles } from "./file.service";
import { Config } from "../types/config";
import * as nodePath from "path";
import { printError } from "../print.service";

export const defaultEnvironmentName: string = "default";

function resolveEnvironment(config: Config, name: string) {
  return nodePath.resolve(config.envRoot, name + ".json");
}

function readEnvironment(
  config: Config,
  name: string | undefined
): Promise<Environment> {
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
  environment: Environment
): Promise<void> {
  return writeJson(resolveEnvironment(config, name), environment);
}

export async function readEnvironmentOrTerminate(
  config: Config,
  name: string | undefined
): Promise<Environment> {
  const environment = await readEnvironment(config, name).catch(() =>
    !name || name === defaultEnvironmentName ? {} : undefined
  );
  if (!environment) {
    console.error(printError("Environment does not exist."));
    process.exit(1);
  }
  return environment;
}

export async function readEnvironmentNames(config: Config): Promise<string[]> {
  const fileNames = await listDirFiles(config.envRoot);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.substring(0, fileName.length - ".json".length));
}
