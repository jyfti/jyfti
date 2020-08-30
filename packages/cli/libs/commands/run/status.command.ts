import { readConfig } from "../../data-access/config.dao";
import { State } from "@jyfti/engine";
import { readWorkflowNamesOrTerminate } from "../../data-access/workflow.dao";
import { readState } from "../../data-access/state-file.service";
import { printValue } from "../../print.service";

export async function status(name?: string): Promise<void> {
  const config = await readConfig();
  const workflowNames = name
    ? [name]
    : await readWorkflowNamesOrTerminate(config);
  const statusList = await Promise.all(
    workflowNames.map(async (workflowName) => {
      const message = await printState(readState(config, workflowName));
      const namePrefix = name ? "" : workflowName + " ";
      return namePrefix + message;
    })
  );
  console.log(statusList.join("\n"));
}

function printState(promisedState: Promise<State>): Promise<string> {
  return promisedState
    .then((state) =>
      state.path.length != 0
        ? printStatus("Pending") + " At step " + JSON.stringify(state.path)
        : printStatus("Completed")
    )
    .catch(() => printStatus("Not running"));
}

function printStatus(status: string): string {
  return printValue(`[${status}]`);
}
