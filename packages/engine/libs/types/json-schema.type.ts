export type JsonSchema = Record<string, unknown>;

export function isJsonSchema(object: unknown): object is JsonSchema {
  return typeof object === "object";
}
