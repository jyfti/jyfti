import { JsonSchema } from "@jyfti/engine";
import { printError } from "../print.service";
import { readJson } from "./file.service";
import { isUrl } from "./workflow.util";
import bent from "bent";
import { Config } from "../types/config";

const getJson = bent("json");

export async function readWorkflowSchemaOrTerminate(
  config: Config
): Promise<JsonSchema> {
  const schema = await readWorkflowSchema(config.schemaLocation).catch(
    () => undefined
  );
  if (!schema) {
    console.error(printError("Workflow schema can not be found."));
    process.exit(1);
  }
  return schema;
}

async function readWorkflowSchema(identifier: string): Promise<JsonSchema> {
  const read = isUrl(identifier) ? getJson : readJson;
  const schema = await read(identifier);
  if (!isWorkflowSchema(schema)) {
    return Promise.reject(
      "The workflow schema file does not represent a valid schema"
    );
  }
  return schema;
}

function isWorkflowSchema(object: unknown): object is JsonSchema {
  return typeof object === "object";
}
