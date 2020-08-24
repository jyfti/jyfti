import { Workflow } from "@jyfti/engine";

export function readWorkflowOrTerminate(): Promise<Workflow> {
  return Promise.resolve({ name: "my-workflow", steps: [] });
}
