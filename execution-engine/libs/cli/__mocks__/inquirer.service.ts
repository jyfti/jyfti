import { Workflow } from "../../engine/types";

let returnsContent: boolean = true;

export function __setReturnsContent(pReturnsContent: boolean) {
  returnsContent = pReturnsContent;
}

export function promptWorkflow(): Promise<string | undefined> {
  return Promise.resolve(returnsContent ? "my-workflow" : undefined);
}

export function promptEnvironment(): Promise<string | undefined> {
  return Promise.resolve(returnsContent ? "my-environment" : undefined);
}

export function promptWorkflowInputs(workflow: Workflow): Promise<string[]> {
  return Promise.resolve(
    returnsContent
      ? Object.keys(workflow.inputs || {}).map((_in, i) => "my-input-" + i)
      : []
  );
}

export function promptOverwriteDecision(): Promise<boolean> {
  return Promise.resolve(returnsContent);
}
