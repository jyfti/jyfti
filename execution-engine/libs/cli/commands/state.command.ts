import { readJiftConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { readStateOrTerminate } from "../files/state-file.service";
import { printJson } from "../print.service";

export async function state(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "The state of which workflow do you want to see?"
    );
  }
  if (name) {
    const state = await readStateOrTerminate(jiftConfig, name);
    console.log(printJson(state));
  }
}
