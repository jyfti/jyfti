import {
  readJiftConfig,
  readWorkflow,
  writeState,
  ensureDirExists,
} from "../file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../inquirer.service";
import { printStepResult, printAllInputErrors } from "../print.service";
import chalk from "chalk";
import { Workflow, Inputs } from "../../engine/types";

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
    if ((inputList || []).length === 0) {
      inputList = await promptWorkflowInputs(workflow);
    }
    const inputs = createInputs(workflow, inputList || []);
    const engine = createEngine(workflow);
    const inputErrors = engine.validate(inputs);
    if (Object.keys(inputErrors).length !== 0) {
      const message =
        chalk.red(
          "The workflow can not be started because some inputs are invalid.\n\n"
        ) + printAllInputErrors(inputErrors, inputs);
      console.error(message);
      process.exit(1);
    } else {
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
}

export function createInputs(workflow: Workflow, inputList: string[]): Inputs {
  return Object.keys(workflow?.inputs || {}).reduce(
    (inputs, inputName, index) => ({
      ...inputs,
      [inputName]: inputList[index],
    }),
    {}
  );
}
