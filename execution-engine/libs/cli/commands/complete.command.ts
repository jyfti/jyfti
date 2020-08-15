import {
  readJiftConfig,
  readWorkflow,
  writeState,
  ensureDirExists,
  readStateOrInitial,
} from "../file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../inquirer.service";
import { printStepResult } from "../print.service";

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
    const inputs = {}; // TODO Add actual inputs
    const state = await readStateOrInitial(jiftConfig, name, inputs);
    const engine = createEngine(workflow);
    engine
      .complete(state)
      .pipe(
        tap((stepResult) =>
          console.log(printStepResult(cmd?.verbose, stepResult))
        ),
        engine.toStates(inputs),
        last(),
        flatMap((state) => from(writeState(jiftConfig, name!, state)))
      )
      .subscribe();
  }
}
