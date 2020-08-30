import { readConfig } from "../../data-access/config.dao";
import { VariableMap } from "@jyfti/engine";
import {
  environmentExists,
  writeEnvironment,
} from "../../data-access/environment-file.service";
import { promptName } from "../../inquirer.service";

export async function generateEnvironment(name?: string): Promise<void> {
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
    const environment = createExampleEnvironment();
    await writeEnvironment(config, name, environment);
  }
}

export function createExampleEnvironment(): VariableMap {
  return {
    baseUrl: "http://localhost:8080",
    token: "abc",
  };
}
