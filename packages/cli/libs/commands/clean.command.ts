import { readConfig } from "../data-access/config.dao";
import { deleteAllStates } from "../data-access/state.dao";

export async function clean(): Promise<void> {
  const config = await readConfig();
  await deleteAllStates(config);
}
