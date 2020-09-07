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
  try {
    return await readWorkflowSchema(config.schemaLocation);
  } catch (err) {
    console.error(printError("The workflow schema can not be read"));
    console.error(err?.stack);
    process.exit(1);
  }
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
