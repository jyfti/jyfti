import { Workflow, Inputs } from "../../../engine/types";

export function readWorkflowOrTerminate(): Promise<Workflow> {
  return Promise.resolve({ name: "my-workflow", steps: [] });
}

export function validateWorkflowOrTerminate(): void {}

export function validateInputsOrTerminate(): void {}

export function validateEnvironmentOrTerminate(): void {}
