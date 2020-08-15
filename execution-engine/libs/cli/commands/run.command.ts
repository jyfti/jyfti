import { readJiftConfig, readWorkflow } from "../file.service";
import { createExecutionEngine } from "../../engine/services/engine.factory";

export async function run(name: string) {
  const jiftConfig = await readJiftConfig();
  const workflow = await readWorkflow(jiftConfig, name);
  const engine = createExecutionEngine();
  engine.executeWorkflow(workflow).subscribe(console.log);
}
