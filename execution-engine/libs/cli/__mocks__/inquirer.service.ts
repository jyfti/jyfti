import { Workflow } from "../../engine/types";

export async function promptWorkflow(): Promise<string | undefined> {
  return "my-workflow";
}

export async function promptEnvironment(): Promise<string | undefined> {
  return "my-environment";
}

export async function promptWorkflowInputs(
  workflow: Workflow
): Promise<string[]> {
  return Object.keys(workflow.inputs || {}).map((_in, i) => "my-input-" + i);
}
