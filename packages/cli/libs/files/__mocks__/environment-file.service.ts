import { VariableMap } from "@jyfti/engine";

let environmentNames: string[] | undefined;

export function __setEnvironmentNames(names: string[] | undefined): void {
  environmentNames = names;
}

let environment: VariableMap | undefined;

export function __setEnvironment(pEnvironment: VariableMap | undefined): void {
  environment = pEnvironment;
}

export function environmentExists(): Promise<boolean> {
  return environment ? Promise.resolve(true) : Promise.resolve(false);
}

export function writeEnvironment(): Promise<void> {
  return Promise.resolve();
}

export async function readEnvironmentOrTerminate(): Promise<VariableMap> {
  return environment ? Promise.resolve(environment) : Promise.reject();
}

export async function readEnvironmentNames(): Promise<string[]> {
  return environmentNames
    ? Promise.resolve(environmentNames)
    : Promise.reject();
}
