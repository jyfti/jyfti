import { Workflow, Inputs } from "../../engine/types";

export function isUrl(name: string): boolean {
  return name.startsWith("http://") || name.startsWith("https://");
}

function extractWorkflowNameFromUrl(url: string): string {
  const segments = new URL(url).pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  return lastSegment.endsWith(".json")
    ? lastSegment.substring(0, lastSegment.length - ".json".length)
    : lastSegment;
}

export function extractWorkflowName(name: string): string {
  return isUrl(name) ? extractWorkflowNameFromUrl(name) : name;
}

export function createInputs(workflow: Workflow, inputList: string[]): Inputs {
  return Object.keys(workflow?.inputs || {}).reduce(
    (inputs, inputName, index) => ({
      ...inputs,
      [inputName]: inputList[index],
    }),
    {}
  );
}
