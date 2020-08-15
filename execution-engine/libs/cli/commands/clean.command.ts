import { readJiftConfig, deleteAllStates } from "../file.service";

export async function clean() {
  const jiftConfig = await readJiftConfig();
  await deleteAllStates(jiftConfig);
}
