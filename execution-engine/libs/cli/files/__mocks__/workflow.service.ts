import { Workflow, Inputs } from "../../../engine/types";

export function isUrl(name: string): boolean {
  return name.startsWith("http://") || name.startsWith("https://");
}

export function extractWorkflowName(): string {
  return "my-workflow";
}

export function readWorkflowOrTerminate(): Promise<Workflow> {
  return Promise.resolve({ name: "my-workflow", steps: [] });
}

export function validateWorkflowOrTerminate(): void {}

export function validateInputsOrTerminate(): void {}

export function validateEnvironmentOrTerminate(): void {}

export function createInputs(): Inputs {
  return {};
}
