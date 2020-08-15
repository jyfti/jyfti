import * as nodePath from "path";
import * as fs from "fs";
import {
  readJiftConfig,
  ensureDirExists,
  readJson,
  resolveState,
  resolveWorkflow,
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
  const tickState = stateExists
    ? await readState(jiftConfig, name)
    : { workflow, path: [0], evaluations: [] };
  if (tickState.path.length === 0) {
    console.log("Workflow execution already completed");
  } else {
    const engine = createExecutionEngine();
    engine
      .executeTick(workflow, tickState)
      .pipe(
        map((pathedEvaluation) => pathedEvaluation.evaluation),
        map((evaluation) =>
          engine.nextTickState(workflow, tickState, evaluation)
        ),
        map((nextTickState) => JSON.stringify(nextTickState, null, 2)),
        flatMap((string) =>
          from(fs.promises.writeFile(statePath, string, "utf8"))
        )
      )
      .subscribe();
  }
}
