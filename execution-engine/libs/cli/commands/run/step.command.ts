import { ensureDirExists } from "../../files/file.service";
import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine";
import { map, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import { readWorkflowOrTerminate } from "../../files/workflow-file.service";
import { writeState, readStateOrTerminate } from "../../files/state-file.service";
import { printStepResult } from "../../print.service";

export async function step(name?: string, cmd?: any) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(
      config,
      "Which workflow do you want to progress?"
    );
  }
  if (name) {
    await ensureDirExists(config.outRoot);
    const workflow = await readWorkflowOrTerminate(config, name);
    const state = await readStateOrTerminate(config, name);
    const engine = createEngine(workflow);
    if (engine.isComplete(state)) {
      console.log("Workflow execution already completed");
    } else {
      engine
        .step(state)
        .pipe(
          tap((stepResult) =>
            console.log(printStepResult(cmd?.verbose, stepResult))
          ),
          map((stepResult) => engine.toState(state, stepResult)),
          flatMap((state) => from(writeState(config, name!, state)))
        )
        .subscribe();
    }
  }
}
