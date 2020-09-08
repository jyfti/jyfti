import * as fs from "fs";
import * as nodePath from "path";
import { Config } from "../types/config";
import { State } from "@jyfti/engine";
import { readFile, writeJson, fileExists } from "./file.service";
import { printError } from "../print.service";

function resolveState(config: Config, name: string) {
  return nodePath.resolve(config.outRoot, name + ".state.json");
}

export function stateExists(config: Config, name: string): Promise<boolean> {
  return fileExists(resolveState(config, name));
}

export function readState(config: Config, name: string): Promise<State> {
  return readFile(resolveState(config, name)).then(JSON.parse).then(toState);
}

function isState(object: unknown): object is State {
  return typeof object === "object";
}

function toState(object: unknown): Promise<State> {
  return isState(object)
    ? Promise.resolve(object)
    : Promise.reject("The state is not valid.");
}

export async function readStateOrTerminate(
  config: Config,
  name: string
): Promise<State> {
  try {
    const content = await readFile(resolveState(config, name));
    try {
      return await toState(JSON.parse(content));
    } catch (err) {
      console.error(printError(err?.message));
      console.error(err?.stack);
      process.exit(1);
    }
  } catch (err) {
    console.error(printError("Workflow execution is not running."));
    console.error(err?.stack);
    process.exit(1);
  }
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
