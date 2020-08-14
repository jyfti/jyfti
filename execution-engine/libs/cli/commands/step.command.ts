import * as nodePath from "path";
import * as fs from "fs";
import { readJiftConfig, ensureDirExists, readJson } from "../file.service";
import { createExecutionEngine } from "libs/engine/services/engine.factory";
import { map, flatMap } from "rxjs/operators";
import { from } from "rxjs";

export async function step(name: string) {
  const jiftConfig = await readJiftConfig();
  const fullPath = nodePath.resolve(jiftConfig.sourceRoot, name + ".json");
  const fullStatePath = nodePath.resolve(
    jiftConfig.outRoot,
    name + ".state.json"
  );
  await ensureDirExists(jiftConfig.outRoot);
  const workflow = await readJson(fullPath);
  const stateExists = await fs.promises
    .stat(fullStatePath)
    .then(() => true)
    .catch(() => false);
  const tickState = stateExists
    ? await readJson(fullStatePath)
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
          from(
            fs.promises.writeFile(
              nodePath.resolve(jiftConfig.outRoot, name + ".state.json"),
              string,
              "utf8"
            )
          )
        )
      )
      .subscribe();
  }
}
