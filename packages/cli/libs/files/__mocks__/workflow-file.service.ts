import { Workflow } from "@jyfti/engine";

let workflowNames: string[] | undefined;

export function __setWorkflowNames(names: string[] | undefined): void {
  workflowNames = names;
}

let workflow: Workflow | undefined = { name: "my-workflow", steps: [] };

export function __setWorkflow(pWorkflow: Workflow | undefined): void {
  workflow = pWorkflow;
}

export async function readWorkflowNames(): Promise<string[]> {
  return workflowNames ? Promise.resolve(workflowNames) : Promise.reject();
}

export async function readWorkflowNamesOrTerminate(): Promise<string[]> {
  return workflowNames ? Promise.resolve(workflowNames) : Promise.reject();
}

export function readWorkflow(): Promise<Workflow> {
  return workflow ? Promise.resolve(workflow) : Promise.reject();
}

export async function readWorkflowOrTerminate(): Promise<Workflow> {
  return workflow ? Promise.resolve(workflow) : Promise.reject();
}

export function workflowExists(): Promise<boolean> {
  return Promise.resolve(!!workflow);
}

export function writeWorkflow(): Promise<void> {
  return Promise.resolve();
}
