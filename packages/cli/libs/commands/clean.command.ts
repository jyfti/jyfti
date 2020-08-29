import { readConfig } from "../files/config-file.service";
import { deleteAllStates } from "../files/state-file.service";

export async function clean(): Promise<void> {
  const config = await readConfig();
  await deleteAllStates(config);
}
