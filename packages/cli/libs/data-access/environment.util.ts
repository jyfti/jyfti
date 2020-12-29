import { Environment } from "@jyfti/engine";
import { merge } from "lodash/fp";

export function parseAssignment(
  assignmentStr: string,
  previous: Environment
): Environment {
  const [accessorString, environmentVariable] = assignmentStr.split("=", 2);
  const accessor = accessorString.split(".");
  const value = process.env[environmentVariable];
  if (!value) {
    throw new Error(
      `The environment variable ${environmentVariable} is not set`
    );
  }
  return mergeEnvironments([previous, extractEnvironment(accessor, value)]);
}

export function mergeEnvironments(environments: Environment[]): Environment {
  return environments.reduce((acc, environment) => merge(acc, environment), {});
}

export function extractEnvironment(
  accessor: string[],
  value: string
): Environment {
  const rightmostAccessorIndex = accessor.length - 1;
  const rightmostObj: Environment = {
    [accessor[rightmostAccessorIndex]]: value,
  };
  return accessor
    .slice(0, rightmostAccessorIndex)
    .reduceRight((acc, part) => ({ [part]: acc }), rightmostObj);
}
