import Ajv, { ErrorObject } from "ajv";
import { InputErrors, SchemaMap, JsonSchema, Inputs } from "../types";

export function validate(object: unknown, schema: JsonSchema): ErrorObject[] {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  validate(object);
  return validate.errors || [];
}

export function validateSchemaMap(
  schemaMap: SchemaMap,
  inputs: Inputs
): InputErrors {
  const results = Object.keys(schemaMap)
    .map((fieldName) => ({
      fieldName,
      errors: validate(inputs[fieldName], schemaMap[fieldName]),
    }))
    .filter((result) => result.errors.length != 0);
  return results.reduce(
    (acc, result) => ({ ...acc, [result.fieldName]: result.errors }),
    {}
  );
}
