import { readConfig } from "../../data-access/config.dao";
import { readEnvironmentNames } from "../../data-access/environment-file.service";

export async function listEnvironments(): Promise<void> {
  const config = await readConfig();
  const names = await readEnvironmentNames(config);
  console.log(names.join("\n"));
}
