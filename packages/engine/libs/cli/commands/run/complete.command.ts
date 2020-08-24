import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import { printStepResult } from "../../print.service";
import { readWorkflowOrTerminate } from "../../files/workflow-file.service";
import {
  writeState,
  readStateOrTerminate,
} from "../../files/state-file.service";
import { readEnvironmentOrTerminate } from "../../files/environment-file.service";
import { validateEnvironmentOrTerminate } from "../../files/workflow.service";

export async function complete(name?: string, cmd?: any) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(
      config,
      "Which workflow do you want to complete?"
    );
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    const state = await readStateOrTerminate(config, name);
    const environment = await readEnvironmentOrTerminate(config, cmd?.environment);
    validateEnvironmentOrTerminate(workflow, environment);
    const engine = createEngine(workflow, environment);
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
