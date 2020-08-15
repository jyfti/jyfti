import {
  readJiftConfig,
  ensureDirExists,
  readWorkflow,
  writeState,
  readStateOrInitial,
} from "../file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { map, flatMap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../inquirer.service";

export async function step(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to progress?"
    );
  }
  if (name) {
    await ensureDirExists(jiftConfig.outRoot);
    const workflow = await readWorkflow(jiftConfig, name);
    const state = await readStateOrInitial(jiftConfig, name, {});
    const engine = createEngine(workflow);
    if (engine.isComplete(state)) {
      console.log("Workflow execution already completed");
    } else {
      engine
        .step(state)
        .pipe(
          map((evaluation) => engine.toState(state, evaluation)),
          flatMap((state) => from(writeState(jiftConfig, name!, state)))
        )
        .subscribe();
    }
  }
}
