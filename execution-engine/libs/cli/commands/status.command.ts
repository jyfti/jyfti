import { readJiftConfig } from "../files/file.service";
import chalk from "chalk";
import { State } from "../../engine/types";
import { readWorkflowNames } from "../files/workflow-file.service";
import { readState } from "../files/state-file.service";

export async function status(name: string) {
  const jiftConfig = await readJiftConfig();
  const workflowNames = name ? [name] : await readWorkflowNames(jiftConfig);
  const statusList = await Promise.all(
    workflowNames.map(async (workflowName) => {
      const message = await printState(readState(jiftConfig, workflowName));
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
  return chalk.yellow(`[${status}]`);
}
