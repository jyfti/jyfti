import * as fs from "fs";
import * as nodePath from "path";
import { Config } from "../types/config";
import { State } from "../../engine/types";
import { readJson } from "./file.service";
import chalk from "chalk";

export function resolveState(config: Config, name: string) {
  return nodePath.resolve(config.outRoot, name + ".state.json");
}

export function readState(config: Config, name: string): Promise<State> {
  return readJson(resolveState(config, name));
}

export async function readStateOrTerminate(
  config: Config,
  name: string
): Promise<State> {
  const state = await readState(config, name).catch(() => undefined);
  if (!state) {
    console.error(chalk.red("Workflow execution is not running."));
    process.exit(1);
  }
  return state;
}

export function writeState(
  config: Config,
  name: string,
  state: State
): Promise<any> {
  const data = JSON.stringify(state, null, 2);
  return fs.promises.writeFile(resolveState(config, name), data, "utf8");
}

export function deleteState(config: Config, name: string): Promise<any> {
  return fs.promises.unlink(resolveState(config, name));
}

export async function deleteAllStates(config: Config): Promise<any> {
  return fs.promises.rmdir(config.outRoot, { recursive: true });
}
