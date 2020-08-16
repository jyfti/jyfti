import { readJiftConfig } from "../files/file.service";
import { promptWorkflow } from "../inquirer.service";
import { readWorkflow } from "../files/workflow-file.service";

export async function view(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to view?"
    );
  }
  if (name) {
    const message = await readWorkflow(jiftConfig, name)
      .then((state) => JSON.stringify(state, null, 2))
      .catch(() => "This workflow does not exist.");
    console.log(message);
  }
}
