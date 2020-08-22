import { VariableMap } from "libs/engine/types";
import { readJson } from "./file.service";
import { Config } from "../types/config";
import * as nodePath from "path";

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
