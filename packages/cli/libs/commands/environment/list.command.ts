import { readConfig } from "../../files/config-file.service";
import { readEnvironmentNames } from "../../files/environment-file.service";

export async function listEnvironments(): Promise<void> {
  const config = await readConfig();
  const names = await readEnvironmentNames(config);
  console.log(names.join("\n"));
}
