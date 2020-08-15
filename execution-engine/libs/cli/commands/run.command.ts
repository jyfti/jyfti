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

export async function run(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(jiftConfig, "Which workflow do you want to run?");
  }
  if (name) {
    await ensureDirExists(jiftConfig.outRoot);
    const workflow = await readWorkflow(jiftConfig, name);
    const engine = createEngine();
    engine
      .executeWorkflow(workflow)
      .pipe(
        tap(console.log),
        engine.toStates(workflow),
        last(),
        flatMap((state) => from(writeState(jiftConfig, name!, state)))
      )
      .subscribe();
  }
}
