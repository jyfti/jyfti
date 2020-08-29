import { ErrorObject } from "ajv";
import { InputErrors } from "../../types";

let success = true;

export function __setResponse(pSuccess: boolean): void {
  success = pSuccess;
}

export const error = {
  keyword: "a",
  dataPath: "b",
  schemaPath: "c",
  params: {},
};

export function validate(): ErrorObject[] {
  return success ? [] : [error];
}

export function validateSchemaMap(): InputErrors {
  return success
    ? {}
    : {
        input: [error],
      };
}
