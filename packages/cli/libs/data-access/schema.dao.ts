import { JsonSchema } from "@jyfti/engine";
import { printError } from "../print.service";
import { readFile } from "./file.service";
import { isUrl } from "./workflow.util";
import bent from "bent";
import { Config } from "../types/config";

const getJson = bent("json");

export async function readWorkflowSchemaOrTerminate(
  config: Config
): Promise<JsonSchema> {
  try {
    return await readWorkflowSchema(config.schemaLocation);
  } catch (err) {
    console.error(printError("The workflow schema can not be read."));
    console.error(err?.stack);
    process.exit(1);
  }
}

async function readWorkflowSchema(identifier: string): Promise<JsonSchema> {
  const read = isUrl(identifier)
    ? getJson
    : (name) => readFile(name).then(JSON.parse);
  return await read(identifier).then(toWorkflowSchema);
}

function isWorkflowSchema(object: unknown): object is JsonSchema {
  return typeof object === "object";
}

function toWorkflowSchema(object: unknown): Promise<JsonSchema> {
  return isWorkflowSchema(object)
    ? Promise.resolve(object)
    : Promise.reject("The workflow schema is not valid.");
}
