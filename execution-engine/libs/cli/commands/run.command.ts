import {
  readJiftConfig,
  readWorkflow,
  writeState,
  ensureDirExists,
} from "../file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow } from "../inquirer.service";
import { printStepResult } from "../print.service";
import { Workflow } from "libs/engine/types/workflow.type";

export async function run(name?: string, inputList?: string[], cmd?: any) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to run?"
    );
  }
  if (name) {
    await ensureDirExists(jiftConfig.outRoot);
    const workflow = await readWorkflow(jiftConfig, name);
    const inputs = createInputs(workflow, inputList || []);
    const engine = createEngine(workflow);
    engine
      .run(inputs)
      .pipe(
        tap((stepResult) =>
          console.log(printStepResult(cmd?.verbose, stepResult))
        ),
        engine.toStates(inputs),
        last(),
        flatMap((state) => from(writeState(jiftConfig, name!, state)))
      )
      .subscribe();
  }
}

export function createInputs(
  workflow: Workflow,
  inputList: string[]
): { [name: string]: any } {
  return Object.keys(workflow.inputs).reduce(
    (inputs, inputName, index) => ({
      ...inputs,
      [inputName]: inputList[index],
    }),
    {}
  );
}
