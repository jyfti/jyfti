import { readJiftConfig, readState, readWorkflowNames } from "../file.service";
import chalk from "chalk";

export async function status(name: string) {
  const jiftConfig = await readJiftConfig();
  const workflowNames = name ? [name] : await readWorkflowNames(jiftConfig);
  const statusList = await Promise.all(
    workflowNames.map(async (workflowName) => {
      const message = await readState(jiftConfig, workflowName)
        .then((state) => state.path)
        .then((path) =>
          path.length != 0
            ? printStatus("Pending") + " At step " + JSON.stringify(path)
            : printStatus("Completed")
        )
        .catch((err) => printStatus("Not running"));
      return workflowName + " " + message;
    })
  );
  console.log(statusList.join("\n"));
}

function printStatus(status: string): string {
  return chalk.yellow(`[${status}]`);
}
