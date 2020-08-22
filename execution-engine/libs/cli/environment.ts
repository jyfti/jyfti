import commander from "commander";
import { viewEnvironment } from "./commands";

export function addEnvironmentSubCommands(command: commander.Command) {
  command
    .command("view [name]")
    .description("view an environment")
    .action(viewEnvironment);
}
