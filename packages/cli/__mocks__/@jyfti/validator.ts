import { ErrorObject } from "ajv";

let success: boolean = true;

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

export function validateSchemaMap() {
  return success
    ? {}
    : {
        input: [error],
      };
}
