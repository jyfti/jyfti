import { readConfig } from "../files/config-file.service";
import chalk from "chalk";
import { State } from "../../engine/types";
import { readWorkflowNames } from "../files/workflow-file.service";
import { readState } from "../files/state-file.service";

export async function status(name: string) {
  const config = await readConfig();
  const workflowNames = name ? [name] : await readWorkflowNames(config);
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
  return chalk.yellow(`[${status}]`);
}
