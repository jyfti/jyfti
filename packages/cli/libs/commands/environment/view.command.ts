import { readConfig } from "../../files/config-file.service";
import { printJson } from "../../print.service";
import {
  readEnvironmentOrTerminate,
  readEnvironmentNames,
} from "../../files/environment-file.service";
import inquirer from "inquirer";

export async function viewEnvironment(name?: string): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const names = await readEnvironmentNames(config);
    name = await promptEnvironment(
      names,
      "Which environment do you want to view?"
    );
  }
  if (name) {
    const environment = await readEnvironmentOrTerminate(config, name);
    console.log(printJson(environment));
  }
}

async function promptEnvironment(
  names: string[],
  question: string
): Promise<string | undefined> {
  const answers = await inquirer.prompt([
    {
      name: "environment",
      message: question,
      type: "list",
      choices: names,
    },
  ]);
  return answers.environment;
}
