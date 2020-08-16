import * as fs from "fs";
import * as nodePath from "path";
import { JiftConfig } from "../types/jift-config";
import { State } from "../../engine/types";
import { readJson } from "./file.service";

export function resolveState(jiftConfig: JiftConfig, name: string) {
  return nodePath.resolve(jiftConfig.outRoot, name + ".state.json");
}

export function readState(
  jiftConfig: JiftConfig,
  name: string
): Promise<State> {
  return readJson(resolveState(jiftConfig, name));
}

export function writeState(
  jiftConfig: JiftConfig,
  name: string,
  state: State
): Promise<any> {
  const data = JSON.stringify(state, null, 2);
  return fs.promises.writeFile(resolveState(jiftConfig, name), data, "utf8");
}

export function deleteState(
  jiftConfig: JiftConfig,
  name: string
): Promise<any> {
  return fs.promises.unlink(resolveState(jiftConfig, name));
}

export async function deleteAllStates(jiftConfig: JiftConfig): Promise<any> {
  return fs.promises.rmdir(jiftConfig.outRoot, { recursive: true });
}
