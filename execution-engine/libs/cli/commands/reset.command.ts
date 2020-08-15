import { readJiftConfig, deleteState } from "../file.service";
import { promptWorkflow } from "../inquirer.service";

export async function reset(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to reset?"
    );
  }
  if (name) {
    await deleteState(jiftConfig, name);
  }
}
