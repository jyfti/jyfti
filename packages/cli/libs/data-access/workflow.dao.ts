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
  const workflow = await readWorkflow(config, name).catch(() => undefined);
  if (!workflow) {
    console.error(printError("Workflow does not exist."));
    process.exit(1);
  }
  return workflow;
}

const getJson = bent("json");

export async function readWorkflowUrlOrTerminate(
  config: Config,
  url: string
): Promise<Workflow> {
  const workflow = (await getJson(url).catch((err) => {
    console.error(printError("Workflow could not be retrieved."));
    console.error(err);
    return undefined;
  })) as Workflow | undefined;
  if (!workflow) {
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
