import { readJiftConfig, readState } from "../file.service";

export async function state(name: string) {
  const jiftConfig = await readJiftConfig();
  const message = await readState(jiftConfig, name)
    .then((state) => JSON.stringify(state, null, 2))
    .catch((err) => process.exit(1));
  console.log(message);
}
