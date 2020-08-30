import * as fs from "fs";
import * as nodePath from "path";
import { Config } from "../types/config";
import { State } from "@jyfti/engine";
import { readJson, writeJson } from "./file.service";
import { printError } from "../print.service";

function resolveState(config: Config, name: string) {
  return nodePath.resolve(config.outRoot, name + ".state.json");
}

export async function readState(config: Config, name: string): Promise<State> {
  const state = await readJson(resolveState(config, name));
  if (!isState(state)) {
    return Promise.reject("The state file does not represent a valid state");
  }
  return state;
}

function isState(object: unknown): object is State {
  return typeof object === "object";
}

export async function readStateOrTerminate(
  config: Config,
  name: string
): Promise<State> {
  const state = await readState(config, name).catch(() => undefined);
  if (!state) {
    console.error(printError("Workflow execution is not running."));
    process.exit(1);
  }
  return state;
}

export function writeState(
  config: Config,
  name: string,
  state: State
): Promise<void> {
  return writeJson(resolveState(config, name), state);
}

export function deleteState(config: Config, name: string): Promise<void> {
  return fs.promises.unlink(resolveState(config, name));
}

export async function deleteAllStates(config: Config): Promise<void> {
  return fs.promises.rmdir(config.outRoot, { recursive: true });
}
