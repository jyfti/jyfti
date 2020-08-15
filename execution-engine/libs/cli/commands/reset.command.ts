import * as fs from "fs";
import { readJiftConfig, resolveState } from "../file.service";

export async function reset(name: string) {
  const jiftConfig = await readJiftConfig();
  const fullStatePath = resolveState(jiftConfig, name);
  await fs.promises.unlink(fullStatePath);
}
