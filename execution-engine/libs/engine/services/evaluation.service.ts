import jsone from "json-e";
import { isNil } from "lodash/fp";
import { VariableMap } from "../types";

export function evaluate(
  variables: VariableMap,
  expression: string | undefined
) {
  return isNil(expression) ? null : jsone(expression, variables);
}
