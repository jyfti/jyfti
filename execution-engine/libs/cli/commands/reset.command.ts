import { readJiftConfig, deleteState, deleteAllStates } from "../file.service";

export async function reset(name?: string) {
  const jiftConfig = await readJiftConfig();
  await (name ? deleteState(jiftConfig, name) : deleteAllStates(jiftConfig));
}
