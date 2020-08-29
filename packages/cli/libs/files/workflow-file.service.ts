import * as nodePath from "path";
import { Config } from "../types/config";
import { Workflow } from "@jyfti/engine";
import { readJson, fileExists, writeJson, listDirFiles } from "./file.service";
import { printError } from "../print.service";

function resolveWorkflow(config: Config, name: string) {
  return nodePath.resolve(config.sourceRoot, name + ".json");
}

export async function readWorkflowNames(config: Config): Promise<string[]> {
  const fileNames = await listDirFiles(config.sourceRoot);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.substring(0, fileName.length - ".json".length));
}

export async function readWorkflowNamesOrTerminate(
  config: Config
): Promise<string[]> {
  const workflow = await readWorkflowNames(config).catch(() => undefined);
  if (!workflow) {
    console.error(
      printError(
        "The workflow names can't be read from the source root '" +
          config.sourceRoot +
          "'"
      )
    );
    process.exit(1);
  }
  return workflow;
}

export async function readWorkflow(
  config: Config,
  name: string
): Promise<Workflow> {
  const workflow = await readJson(resolveWorkflow(config, name));
  if (!isWorkflow(workflow)) {
    return Promise.reject(
      "The workflow file does not represent a valid workflow"
    );
  }
  return workflow;
}

function isWorkflow(object: unknown): object is Workflow {
  return typeof object === "object";
}

export async function readWorkflowOrTerminate(
  config: Config,
  name: string
): Promise<Workflow> {
  const workflow = await readWorkflow(config, name).catch(() => undefined);
  if (!workflow) {
    console.error(printError("Workflow does not exist."));
    process.exit(1);
  }
  return workflow;
}

export function workflowExists(config: Config, name: string): Promise<boolean> {
  return fileExists(resolveWorkflow(config, name));
}

export function writeWorkflow(
  config: Config,
  name: string,
  workflow: Workflow
): Promise<void> {
  return writeJson(resolveWorkflow(config, name), workflow);
}
