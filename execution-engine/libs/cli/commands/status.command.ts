import * as nodePath from "path";
import { readJiftConfig, readJson } from "../file.service";

export async function status(name: string) {
  const jiftConfig = await readJiftConfig();
  const state = await readJson(
    nodePath.resolve(jiftConfig.outRoot, name + ".state.json")
  );
  console.log(JSON.stringify(state, null, 2));
}
