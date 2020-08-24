import { readConfig } from "../../files/config-file.service";
import { promptWorkflow } from "../../inquirer.service";
import { deleteState } from "../../files/state-file.service";

export async function reset(name?: string) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(config, "Which workflow do you want to reset?");
  }
  if (name) {
    await deleteState(config, name);
  }
}
