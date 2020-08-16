import commander from "commander";
import { generateWorkflow } from "./commands";

export function addGenerateSubCommands(command: commander.Command) {
  command
    .command("workflow [name]")
    .description("generate a workflow")
    .action(generateWorkflow);
}
