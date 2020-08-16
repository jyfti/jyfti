import { ensureDirExists } from "../files/file.service";
import { readJiftConfig } from "../files/config-file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { map, flatMap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../inquirer.service";
import chalk from "chalk";
import { readWorkflowOrTerminate } from "../files/workflow-file.service";
import {
  readState,
  writeState,
  readStateOrTerminate,
} from "../files/state-file.service";

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
    const workflow = await readWorkflowOrTerminate(jiftConfig, name);
    const state = await readStateOrTerminate(jiftConfig, name);
    const engine = createEngine(workflow);
    if (engine.isComplete(state)) {
      console.log("Workflow execution already completed");
    } else {
      engine
        .step(state)
        .pipe(
          map((evaluation) => engine.toState(state, evaluation)),
          flatMap((state) => from(writeState(jiftConfig, name!, state)))
        )
        .subscribe();
    }
  }
}
