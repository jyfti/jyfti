import * as fs from "fs";
import {
  readJiftConfig,
  ensureDirExists,
  resolveState,
  readState,
  fileExists,
  readWorkflow,
} from "../file.service";
import { createExecutionEngine } from "../../engine/services/engine.factory";
import { map, flatMap } from "rxjs/operators";
import { from } from "rxjs";

export async function step(name: string) {
  const jiftConfig = await readJiftConfig();
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
    const engine = createExecutionEngine();
    engine
      .executeStep(workflow, state)
      .pipe(
        map((pathedEvaluation) => pathedEvaluation.evaluation),
        map((evaluation) => engine.nextState(workflow, state, evaluation)),
        map((nextState) => JSON.stringify(nextState, null, 2)),
        flatMap((string) =>
          from(fs.promises.writeFile(statePath, string, "utf8"))
        )
      )
      .subscribe();
  }
}
