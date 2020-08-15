import { readJiftConfig, readWorkflow, writeState } from "../file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";

export async function run(name: string) {
  const jiftConfig = await readJiftConfig();
  const workflow = await readWorkflow(jiftConfig, name);
  const engine = createEngine();
  engine
    .executeWorkflow(workflow)
    .pipe(
      tap(console.log),
      engine.toStates(workflow),
      last(),
      flatMap((state) => from(writeState(jiftConfig, name, state)))
    )
    .subscribe();
}
