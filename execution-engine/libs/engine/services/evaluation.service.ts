import jsone from "json-e";
import { isNil } from "lodash/fp";
import { VariableMap } from "../types";

export function interpolate(variables: VariableMap, str: string) {
  const identifiers = Object.keys(variables);
  const values = Object.values(variables);
  return new Function(...identifiers, `return \`${str}\`;`)(...values);
}

export function evaluate(
  variables: VariableMap,
  expression: string | undefined
) {
  return isNil(expression) ? null : jsone(JSON.parse(expression), variables);
}
