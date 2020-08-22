import { readConfig } from "../../files/config-file.service";
import inquirer from "inquirer";
import { VariableMap } from "../../../engine/types";
import {
  environmentExists,
  writeEnvironment,
} from "../../../cli/files/environment-file.service";

export async function generateEnvironment(name?: string) {
  const config = await readConfig();
  if (!name) {
    const answers = await inquirer.prompt([
      {
        name: "name",
        message: "What shall be the name of the environment?",
        type: "string",
        default: "default",
      },
    ]);
    name = answers.name;
  }
  if (name) {
    if (await environmentExists(config, name)) {
      console.error(
        "The environment already exists. Please delete the environment first."
      );
      process.exit(1);
    }
    const workflow = createExampleEnvironment();
    await writeEnvironment(config, name, workflow);
  }
}

export function createExampleEnvironment(): VariableMap {
  return {
    baseUrl: "http://localhost:8080",
    token: "abc",
  };
}
