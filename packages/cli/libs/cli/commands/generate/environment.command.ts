import { readConfig } from "../../files/config-file.service";
import { VariableMap } from "@jyfti/engine";
import {
  environmentExists,
  writeEnvironment,
} from "../../files/environment-file.service";
import { promptName } from "../../inquirer.service";

export async function generateEnvironment(name?: string) {
  const config = await readConfig();
  if (!name) {
    name = await promptName("environment");
  }
  if (name) {
    if (await environmentExists(config, name)) {
      console.error(
        "The environment already exists. Please delete the environment first."
      );
      process.exitCode = 1;
      return;
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
