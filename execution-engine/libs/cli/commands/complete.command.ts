import { ensureDirExists } from "../files/file.service";
import { readJiftConfig } from "../files/config-file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../inquirer.service";
import { printStepResult } from "../print.service";
import chalk from "chalk";
import { readWorkflow } from "../files/workflow-file.service";
import { readState, writeState } from "../files/state-file.service";

export async function complete(name?: string, cmd?: any) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to complete?"
    );
  }
  if (name) {
    await ensureDirExists(jiftConfig.outRoot);
    const workflow = await readWorkflow(jiftConfig, name);
    const state = await readState(jiftConfig, name).catch(() => undefined);
    if (!state) {
      console.error(chalk.red("Workflow execution is not running"));
    } else {
      const engine = createEngine(workflow);
      engine
        .complete(state)
        .pipe(
          tap((stepResult) =>
            console.log(printStepResult(cmd?.verbose, stepResult))
          ),
          engine.toStates(state.inputs),
          last(),
          flatMap((state) => from(writeState(jiftConfig, name!, state)))
        )
        .subscribe();
    }
  }
}
