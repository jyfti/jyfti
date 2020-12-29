import { Environment } from "@jyfti/engine";
import { Assignment } from "../types/assignment.type";

export function mergeEnvironments(environments: Environment[]): Environment {
  return environments.reduce(
    (acc, environment) => ({ ...acc, ...environment }),
    {}
  );
}

export function extractEnvironments(assignments: Assignment[]): Environment[] {
  return assignments.map(extractEnvironment);
}

function extractEnvironment(assignment: Assignment): Environment {
  const rightmostAccessorIndex = assignment.accessor.length - 1;
  const rightmostObj: Environment = {
    [assignment.accessor[rightmostAccessorIndex]]: assignment.value,
  };
  return assignment.accessor
    .slice(0, rightmostAccessorIndex)
    .reduceRight((acc, part) => ({ [part]: acc }), rightmostObj);
}
