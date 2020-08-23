import bent from "bent";
import { Config } from "../types/config";
import { Workflow } from "../../engine/types";
import { printError } from "../print.service";

const getJson = bent("json");

export function extractWorkflowName(url: string): string {
  const segments = new URL(url).pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  return lastSegment.endsWith(".json")
    ? lastSegment.substring(0, lastSegment.length - ".json".length)
    : lastSegment;
}

export async function readWorkflowOrTerminate(
  config: Config,
  url: string
): Promise<Workflow> {
  const workflow = (await getJson(url).catch((err) => {
    console.error(printError("Workflow could not be retrieved."));
    console.error(err);
    return undefined;
  })) as Workflow | undefined;
  if (!workflow) {
    process.exit(1);
  }
  return workflow;
}
