import { Config } from "../types/config";
import { Workflow, Inputs } from "../../engine/types";
import * as http from "./workflow-http.service";
import * as file from "./workflow-file.service";
import chalk from "chalk";
import { printAllInputErrors } from "../print.service";
import { validateInputs } from "../../engine/services/validator.service";

export class WorkflowService {
  isUrl(name: string): boolean {
    return name.startsWith("http://") || name.startsWith("https://");
  }

  extractWorkflowName(name: string): string {
    return this.isUrl(name) ? http.extractWorkflowName(name) : name;
  }

  readWorkflowOrTerminate(config: Config, name: string): Promise<Workflow> {
    const readWorkflowOrTerminate = this.isUrl(name)
      ? http.readWorkflowOrTerminate
      : file.readWorkflowOrTerminate;
    return readWorkflowOrTerminate(config, name);
  }

  validateInputsOrTerminate(workflow: Workflow, inputs: Inputs): void {
    const inputErrors = validateInputs(workflow.inputs || {}, inputs);
    if (Object.keys(inputErrors).length !== 0) {
      const message =
        chalk.red(
          "The workflow can not be started because some inputs are invalid.\n\n"
        ) + printAllInputErrors(inputErrors, inputs);
      console.error(message);
      process.exit(1);
    }
  }

  createInputs(workflow: Workflow, inputList: string[]): Inputs {
    return Object.keys(workflow?.inputs || {}).reduce(
      (inputs, inputName, index) => ({
        ...inputs,
        [inputName]: inputList[index],
      }),
      {}
    );
  }
}
