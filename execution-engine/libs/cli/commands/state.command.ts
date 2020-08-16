import { readConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { readStateOrTerminate } from "../files/state-file.service";
import { printJson } from "../print.service";

export async function state(name?: string) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(
      config,
      "The state of which workflow do you want to see?"
    );
  }
  if (name) {
    const state = await readStateOrTerminate(config, name);
    console.log(printJson(state));
  }
}
