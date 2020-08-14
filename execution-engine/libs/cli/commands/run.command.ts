import { readJiftConfig, readJson } from "../file.service";
import * as nodePath from "path";
import { createExecutionEngine } from "libs/engine/services/engine.factory";

export async function run(name: string) {
  const jiftConfig = await readJiftConfig();
  const workflow = await readJson(
    nodePath.resolve(jiftConfig.sourceRoot, name + ".json")
  );
  const engine = createExecutionEngine();
  engine.executeWorkflow(workflow).subscribe(console.log);
}
