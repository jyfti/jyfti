import { readJiftConfig } from "../files/file.service";
import { deleteAllStates } from "../files/state-file.service";

export async function clean() {
  const jiftConfig = await readJiftConfig();
  await deleteAllStates(jiftConfig);
}
