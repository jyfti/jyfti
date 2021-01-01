import jsone from "json-e";
import { VariableMap, JsonExpression } from "../types";

export const functions = {
  str: (obj: Record<string, unknown> | undefined | null): string =>
    obj ? obj.toString() : "null",
  join: (array: unknown[], sep?: string): string => array.join(sep),
  find: (
    array: Record<string, unknown>[],
    property: string,
    expected: unknown
  ): unknown =>
    array.find((element) => element && element[property] === expected),
};

export function evaluate(
  variables: VariableMap,
  expression: JsonExpression | undefined
): unknown {
  return expression === undefined
    ? null
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsone(expression as any, { ...variables, ...functions });
}
