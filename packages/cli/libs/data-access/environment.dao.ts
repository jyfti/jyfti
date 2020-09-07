import { Environment } from "@jyfti/engine";
import { readJson, fileExists, writeJson, listDirFiles } from "./file.service";
import { Config } from "../types/config";
import * as nodePath from "path";
import { printError } from "../print.service";

export const defaultEnvironmentName = "default";

function resolveEnvironment(config: Config, name: string) {
  return nodePath.resolve(config.envRoot, name + ".json");
}

function readEnvironment(
  config: Config,
  name: string | undefined
): Promise<Environment> {
  return readJson(
    resolveEnvironment(config, name || defaultEnvironmentName)
  ).then(toEnvironment);
}

function isEnvironment(object: unknown): object is Environment {
  return typeof object === "object";
}

function toEnvironment(object: unknown): Promise<Environment> {
  return isEnvironment(object)
    ? Promise.resolve(object)
    : Promise.reject("The environment is not valid.");
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
  try {
    return await readEnvironment(config, name);
  } catch (err) {
    if (!name || name === defaultEnvironmentName) {
      return Promise.resolve({});
    }
    console.error(printError("The environment can not be read."));
    console.error(err?.stack);
    process.exit(1);
  }
}

export async function readEnvironmentNames(config: Config): Promise<string[]> {
  const fileNames = await listDirFiles(config.envRoot);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.substring(0, fileName.length - ".json".length));
}
