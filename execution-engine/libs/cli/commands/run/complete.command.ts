import { ensureDirExists } from "../../files/file.service";
import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import { printStepResult } from "../../print.service";
import { readWorkflowOrTerminate } from "../../files/workflow-file.service";
import { writeState, readStateOrTerminate } from "../../files/state-file.service";

export async function complete(name?: string, cmd?: any) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(
      config,
      "Which workflow do you want to complete?"
    );
  }
  if (name) {
    await ensureDirExists(config.outRoot);
    const workflow = await readWorkflowOrTerminate(config, name);
    const state = await readStateOrTerminate(config, name);
    const engine = createEngine(workflow);
    engine
      .complete(state)
      .pipe(
        tap((stepResult) =>
          console.log(printStepResult(cmd?.verbose, stepResult))
        ),
        engine.toStates(state.inputs),
        last(),
        flatMap((state) => from(writeState(config, name!, state)))
      )
      .subscribe();
  }
}
