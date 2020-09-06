import { readConfig } from "../../data-access/config.dao";
import { readEnvironmentNames } from "../../data-access/environment.dao";
import { uniq } from "lodash/fp";

export async function listEnvironments(): Promise<void> {
  const config = await readConfig();
  const names = uniq(["default"].concat(await readEnvironmentNames(config)));
  console.log(names.join("\n"));
}
