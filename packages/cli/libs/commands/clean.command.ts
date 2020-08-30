import { readConfig } from "../data-access/config-file.service";
import { deleteAllStates } from "../data-access/state-file.service";

export async function clean(): Promise<void> {
  const config = await readConfig();
  await deleteAllStates(config);
}
