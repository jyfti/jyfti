import { VariableMap } from "libs/engine/types";
import { readJson, fileExists } from "./file.service";
import { Config } from "../types/config";
import * as nodePath from "path";
import * as fs from "fs";

export const defaultEnvironmentName: string = "default";

export function resolveEnvironment(config: Config, name: string) {
  return nodePath.resolve(config.envRoot, name + ".json");
}

export async function readEnvironment(
  config: Config,
  name: string | undefined
): Promise<VariableMap> {
  return await readJson(
    resolveEnvironment(config, name || defaultEnvironmentName)
  ).catch(() => ({}));
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
