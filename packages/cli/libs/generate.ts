import commander from "commander";
import { generateWorkflow, generateEnvironment } from "./commands";

export function addGenerateSubCommands(command: commander.Command): void {
  command
    .command("workflow [name]", { isDefault: true })
    .description("generate a workflow")
    .action(generateWorkflow);

  command
    .command("environment [name]")
    .description("generate an environment")
    .action(generateEnvironment);
}
