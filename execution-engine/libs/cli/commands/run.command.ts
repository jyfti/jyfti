import {
  readJiftConfig,
  readWorkflow,
  writeState,
  ensureDirExists,
} from "../file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../inquirer.service";
import { PathedEvaluation } from "../../engine/types/pathed-evaluation.type";
import chalk from "chalk";

export async function run(name?: string, cmd?: any) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to run?"
    );
  }
  if (name) {
    await ensureDirExists(jiftConfig.outRoot);
    const workflow = await readWorkflow(jiftConfig, name);
    const engine = createEngine(workflow);
    engine
      .run()
      .pipe(
        tap((pathedEvaluation) =>
          console.log(printPathedEvaluation(cmd, pathedEvaluation))
        ),
        engine.service.toStates(workflow),
        last(),
        flatMap((state) => from(writeState(jiftConfig, name!, state)))
      )
      .subscribe();
  }
}

function printPathedEvaluation(
  cmd: any,
  pathedEvaluation: PathedEvaluation
): string {
  return cmd?.verbose
    ? JSON.stringify(pathedEvaluation, null, 2)
    : "Completed " + chalk.green(pathedEvaluation.path);
}
