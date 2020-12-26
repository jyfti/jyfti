import { readConfig } from "../../data-access/config.dao";
import { State, Path } from "@jyfti/engine";
import { readWorkflowNamesOrTerminate } from "../../data-access/workflow.dao";
import { readState, stateExists } from "../../data-access/state.dao";
import {
  printValue,
  printSuccess,
  printError,
  printJson,
} from "../../print.service";

export async function status(name?: string): Promise<void> {
  const config = await readConfig();
  const workflowNames = name
    ? [name]
    : await readWorkflowNamesOrTerminate(config);
  const statusList = await Promise.all(
    workflowNames.map(async (workflowName) => {
      const message = (await stateExists(config, workflowName))
        ? await readState(config, workflowName)
            .then(printState)
            .catch(printError)
        : printStatus("Not running");
      const namePrefix = name ? "" : workflowName + " ";
      return namePrefix + message;
    })
  );
  console.log(statusList.join("\n"));
}

function printState(state: State): string {
  return state.error
    ? printStatus("Failed") +
        " At step " +
        printPath(state.path) +
        "\n" +
        printJson(state.error)
    : state.path.length != 0
    ? printStatus("Pending") + " At step " + printPath(state.path)
    : printStatus("Completed");
}

function printPath(path: Path): string {
  return printValue(JSON.stringify(path));
}

function printStatus(status: string): string {
  const printer =
    status === "Completed"
      ? printSuccess
      : status === "Failed"
      ? printError
      : printValue;
  return printer(`[${status}]`);
}
