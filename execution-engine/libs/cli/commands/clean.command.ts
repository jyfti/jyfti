import { readJiftConfig, deleteAllStates } from "../files/file.service";

export async function clean() {
  const jiftConfig = await readJiftConfig();
  await deleteAllStates(jiftConfig);
}
