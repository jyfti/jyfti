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
import { State } from "../../engine/types/state.type";
import { JiftConfig } from "../types/jift-config";

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
    const state = await readStateOrInitial(jiftConfig);
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

export async function readStateOrInitial(
  jiftConfig: JiftConfig
): Promise<State> {
  const statePath = resolveState(jiftConfig, name);
  const stateExists = await fileExists(statePath);
  return stateExists ? await readState(jiftConfig, name) : initialState;
}

const initialState: State = { path: [0], evaluations: [] };
