import * as nodePath from "path";
import * as fs from "fs";
import { readJiftConfig } from "../file.service";

export async function reset(name: string) {
  const jiftConfig = await readJiftConfig();
  const fullStatePath = nodePath.resolve(
    jiftConfig.outRoot,
    name + ".state.json"
  );
  await fs.promises.unlink(fullStatePath);
}
