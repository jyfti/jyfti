import jsone from "json-e";
import { isNil } from "lodash/fp";
import { VariableMap } from "../types";

export const functions = {
  str: (obj: any) => (obj ? obj.toString() : "null"),
  join: (array: any[], sep?: string) => array.join(sep),
};

export function evaluate(
  variables: VariableMap,
  expression: string | undefined
) {
  return isNil(expression)
    ? null
    : jsone(expression, { ...variables, ...functions });
}
