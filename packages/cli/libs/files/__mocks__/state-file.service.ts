import { State } from "@jyfti/engine";

let state: State | undefined;

export function __setState(pState: State | undefined): void {
  state = pState;
}

export function readState(): Promise<State> {
  return state ? Promise.resolve(state) : Promise.reject();
}

export async function readStateOrTerminate(): Promise<State> {
  return state ? Promise.resolve(state) : Promise.reject();
}

export function writeState(): Promise<void> {
  return Promise.resolve();
}

export function deleteState(): Promise<void> {
  return Promise.resolve();
}

export function deleteAllStates(): Promise<void> {
  return Promise.resolve();
}
