import { ensureDirExists } from "../files/file.service";
import { readJiftConfig } from "../files/config-file.service";
import { createEngine } from "../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../inquirer.service";
import {
  printStepResult,
  printAllInputErrors,
  printJson,
} from "../print.service";
import chalk from "chalk";
import { Workflow, Inputs } from "../../engine/types";
import { readWorkflow } from "../files/workflow-file.service";
import { writeState } from "../files/state-file.service";

export async function start(name?: string, inputList?: string[], cmd?: any) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to start?"
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
      const initialState = engine.init(inputs);
      console.log("Created state.");
      if (cmd?.verbose) {
        console.log(printJson(initialState));
      }
      if (!cmd?.complete) {
        await writeState(jiftConfig, name, initialState);
      } else {
        engine
          .complete(initialState)
          .pipe(
            tap((stepResult) =>
              console.log(printStepResult(cmd?.verbose, stepResult))
            ),
            engine.toStates(inputs),
            last(),
            tap((state) => console.log(printJson(engine.getOutput(state)))),
            flatMap((state) => from(writeState(jiftConfig, name!, state)))
          )
          .subscribe();
      }
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
