import { ensureDirExists } from "../../files/file.service";
import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine.factory";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import { printStepResult, printJson, printOutput } from "../../print.service";
import { WorkflowService } from "../../files/workflow.service";
import { writeState } from "../../files/state-file.service";

export async function execute(name?: string, inputList?: string[], cmd?: any) {
  const workflowService = new WorkflowService();
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(config, "Which workflow do you want to start?");
  }
  if (name) {
    await ensureDirExists(config.outRoot);
    const workflow = await workflowService.readWorkflowOrTerminate(
      config,
      name
    );
    name = workflowService.isUrl(name)
      ? workflowService.extractWorkflowName(name)
      : name;
    if ((inputList || []).length === 0) {
      inputList = await promptWorkflowInputs(workflow);
    }
    const inputs = workflowService.createInputs(workflow, inputList || []);
    workflowService.validateInputsOrTerminate(workflow, inputs);
    const engine = createEngine(workflow);
    const initialState = engine.init(inputs);
    console.log("Created state.");
    if (cmd?.verbose) {
      console.log(printJson(initialState));
    }
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
