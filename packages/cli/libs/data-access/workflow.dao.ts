import * as nodePath from "path";
import { Config } from "../types/config";
import { Workflow } from "@jyfti/engine";
import { readJson, fileExists, writeJson, listDirFiles } from "./file.service";
import { printError } from "../print.service";
import { isUrl } from "./workflow.util";
import bent from "bent";

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
  try {
    return await readWorkflowNames(config);
  } catch (err) {
    console.error(
      printError(
        `The workflow names can't be read from the source root '${config.sourceRoot}'`
      )
    );
    console.error(err?.stack);
    process.exit(1);
  }
}

export async function readWorkflow(
  config: Config,
  name: string
): Promise<Workflow> {
  return await readJson(resolveWorkflow(config, name)).then(toWorkflow);
}

function isWorkflow(object: unknown): object is Workflow {
  return typeof object === "object";
}

function toWorkflow(object: unknown): Promise<Workflow> {
  return isWorkflow(object)
    ? Promise.resolve(object)
    : Promise.reject("The workflow is not a valid.");
}

export function readWorkflowOrTerminate(
  config: Config,
  name: string
): Promise<Workflow> {
  const readWorkflowOrTerminate = isUrl(name)
    ? readWorkflowUrlOrTerminate
    : readWorkflowFileOrTerminate;
  return readWorkflowOrTerminate(config, name);
}

async function readWorkflowFileOrTerminate(
  config: Config,
  name: string
): Promise<Workflow> {
  try {
    return await readWorkflow(config, name);
  } catch (err) {
    console.error(printError("The workflow can not be read."));
    console.error(err?.stack);
    process.exit(1);
  }
}

const getJson = bent("json");

export async function readWorkflowUrlOrTerminate(
  config: Config,
  url: string
): Promise<Workflow> {
  try {
    return await getJson(url).then(toWorkflow);
  } catch (err) {
    console.error(printError("The workflow could not be retrieved."));
    console.error(err?.stack);
    process.exit(1);
  }
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
