import { readJiftConfig, readWorkflow } from "../files/file.service";
import { promptWorkflow } from "../inquirer.service";
import { validateWorkflow } from "../../engine/services/validator.service";
import { printValidationErrors } from "../print.service";

export async function validate(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to validate?"
    );
  }
  if (name) {
    const workflow = await readWorkflow(jiftConfig, name);
    const errors = await validateWorkflow(workflow);
    if (errors.length != 0) {
      console.log(printValidationErrors(errors));
      process.exit(1);
    }
  }
}
