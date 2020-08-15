import { readJiftConfig, readState } from "../file.service";

export async function status(name: string) {
  const jiftConfig = await readJiftConfig();
  const state = await readState(jiftConfig, name);
  console.log(JSON.stringify(state, null, 2));
}
