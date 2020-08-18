import { ensureDirExists } from "../../files/file.service";
import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import {
  printStepResult,
  printAllInputErrors,
  printJson,
  printOutput,
} from "../../print.service";
import chalk from "chalk";
import { Workflow, Inputs } from "../../../engine/types";
import {
  readWorkflowOrTerminate,
  extractWorkflowName,
  isUrl,
} from "../../files/workflow.service";
import { writeState } from "../../files/state-file.service";
import { install } from "../../install.service";
import { readWorkflowSchemaOrTerminate } from "../../../cli/files/workflow-file.service";

export async function start(name?: string, inputList?: string[], cmd?: any) {
  const config = await readConfig();
  const schema = await readWorkflowSchemaOrTerminate();
  if (!name) {
    name = await promptWorkflow(config, "Which workflow do you want to start?");
  }
  if (name) {
    await ensureDirExists(config.outRoot);
    const workflow = await readWorkflowOrTerminate(config, name);
    if (isUrl(name)) {
      name = extractWorkflowName(name);
      await install(config, workflow, schema, name, cmd?.yes);
    }
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
        await writeState(config, name, initialState);
      } else {
        engine
          .complete(initialState)
          .pipe(
            tap((stepResult) =>
              console.log(printStepResult(cmd?.verbose, stepResult))
            ),
            engine.toStates(inputs),
            last(),
            tap((state) => console.log(printOutput(engine.getOutput(state)))),
            flatMap((state) => from(writeState(config, name!, state)))
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
