import { readConfig } from "../../files/config-file.service";
import { createEngine } from "@jyfti/engine";
import { map, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import { readWorkflowOrTerminate } from "../../files/workflow-file.service";
import {
  writeState,
  readStateOrTerminate,
} from "../../files/state-file.service";
import { printStepResult, printError } from "../../print.service";
import { readEnvironmentOrTerminate } from "../../files/environment-file.service";
import { validateEnvironmentOrTerminate } from "../../files/workflow.service";

export async function step(name?: string, cmd?: any) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(
      config,
      "Which workflow do you want to progress?"
    );
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    const state = await readStateOrTerminate(config, name);
    const environment = await readEnvironmentOrTerminate(
      config,
      cmd?.environment
    );
    validateEnvironmentOrTerminate(workflow, environment);
    const engine = createEngine(workflow, environment);
    if (engine.isComplete(state)) {
      console.log("Workflow execution already completed");
    } else {
      engine
        .step(state)
        .pipe(
          tap(
            (stepResult) =>
              console.log(printStepResult(cmd?.verbose, stepResult)),
            (error) => console.error("Failed " + printError(error))
          ),
          map((stepResult) => engine.transition(state, stepResult)),
          flatMap((state) => from(writeState(config, name!, state)))
        )
        .subscribe(
          () => {},
          () => {},
          () => {}
        );
    }
  }
}
