import { readConfig } from "../../files/config-file.service";
import { printJson } from "../../print.service";
import { readEnvironmentOrTerminate } from "../../../cli/files/environment-file.service";
import { promptEnvironment } from "../../../cli/inquirer.service";

export async function viewEnvironment(name?: string) {
  const config = await readConfig();
  if (!name) {
    name = await promptEnvironment(
      config,
      "Which environment do you want to view?"
    );
  }
  if (name) {
    const environment = await readEnvironmentOrTerminate(config, name);
    console.log(printJson(environment));
  }
}
