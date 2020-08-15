import {
  readJiftConfig,
  ensureDirExists,
  resolveState,
  readState,
  fileExists,
  readWorkflow,
  writeState,
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
    const statePath = resolveState(jiftConfig, name);
    const stateExists = await fileExists(statePath);
    const state = stateExists
      ? await readState(jiftConfig, name)
      : { workflow, path: [0], evaluations: [] };
    if (state.path.length === 0) {
      console.log("Workflow execution already completed");
    } else {
      const engine = createEngine(workflow);
      engine
        .step(state)
        .pipe(
          map((pathedEvaluation) => pathedEvaluation.evaluation),
          map((evaluation) =>
            engine.service.nextState(workflow, state, evaluation)
          ),
          flatMap((state) => from(writeState(jiftConfig, name!, state)))
        )
        .subscribe();
    }
  }
}
