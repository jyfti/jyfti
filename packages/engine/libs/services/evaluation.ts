import jsone from "json-e";
import { VariableMap } from "../types";

export const functions = {
  str: (obj: any) => (obj ? obj.toString() : "null"),
  join: (array: any[], sep?: string) => array.join(sep),
};

export function evaluate(
  variables: VariableMap,
  expression: string | undefined
) {
  return expression === undefined
    ? null
    : jsone(expression, { ...variables, ...functions });
}
