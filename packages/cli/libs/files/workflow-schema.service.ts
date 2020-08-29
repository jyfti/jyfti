import { JsonSchema } from "@jyfti/engine";
import { printError } from "../print.service";
import { readJson } from "./file.service";

export async function readWorkflowSchema(): Promise<JsonSchema> {
  // TODO Make flexible
  const schema = await readJson("../../workflow-schema.json");
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

export async function readWorkflowSchemaOrTerminate(): Promise<JsonSchema> {
  const schema = await readWorkflowSchema().catch(() => undefined);
  if (!schema) {
    console.error(printError("Workflow schema can not be found."));
    process.exit(1);
  }
  return schema;
}
