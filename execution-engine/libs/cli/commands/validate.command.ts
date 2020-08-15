import { readJiftConfig, readWorkflow } from "../file.service";
import { promptWorkflow } from "../inquirer.service";
import { validateWorkflow } from "../validator.service";

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
      console.log(errors);
      process.exit(1);
    }
  }
}
