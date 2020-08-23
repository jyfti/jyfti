import { Workflow, JsonSchema } from "../../../engine/types";

let workflowNames: string[] | undefined;

export function __setWorkflowNames(names: string[] | undefined): void {
  workflowNames = names;
}

export async function readWorkflowNames(): Promise<string[]> {
  return workflowNames ? Promise.resolve(workflowNames) : Promise.reject();
}

export function readWorkflow(): Promise<Workflow> {
  return Promise.resolve({ name: "my-workflow", steps: [] });
}

export async function readWorkflowOrTerminate(): Promise<Workflow> {
  return Promise.resolve({ name: "my-workflow", steps: [] });
}

export function readWorkflowSchema(): Promise<JsonSchema> {
  return Promise.resolve({});
}

export async function readWorkflowSchemaOrTerminate(): Promise<JsonSchema> {
  return Promise.resolve({});
}

export function workflowExists(): Promise<boolean> {
  return Promise.resolve(true);
}

export function writeWorkflow(): Promise<void> {
  return Promise.resolve();
}
