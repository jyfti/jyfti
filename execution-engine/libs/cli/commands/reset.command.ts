import { readJiftConfig, deleteState } from "../file.service";

export async function reset(name: string) {
  const jiftConfig = await readJiftConfig();
  await deleteState(jiftConfig, name);
}
