import { readJiftConfig } from "../files/file.service";
import { promptWorkflow } from "../inquirer.service";
import { deleteState } from "../files/state-file.service";

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
