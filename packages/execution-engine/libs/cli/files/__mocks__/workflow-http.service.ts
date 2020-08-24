import { Workflow } from "../../../engine/types";

export function readWorkflowOrTerminate(): Promise<Workflow> {
  return Promise.resolve({ name: "my-workflow", steps: [] });
}
