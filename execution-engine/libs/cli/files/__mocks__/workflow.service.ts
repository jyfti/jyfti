import { Workflow } from "../../../engine/types";

let workflow: Workflow;

export function __setWorkflow(pWorkflow: Workflow): void {
  workflow = pWorkflow;
}

export function readWorkflowOrTerminate(): Promise<Workflow> {
  return workflow ? Promise.resolve(workflow) : Promise.reject();
}

export function validateWorkflowOrTerminate(): void {}

export function validateInputsOrTerminate(): void {}

export function validateEnvironmentOrTerminate(): void {}
