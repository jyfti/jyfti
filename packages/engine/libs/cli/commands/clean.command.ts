import { readConfig } from "../files/config-file.service";
import { deleteAllStates } from "../files/state-file.service";

export async function clean() {
  const config = await readConfig();
  await deleteAllStates(config);
}
