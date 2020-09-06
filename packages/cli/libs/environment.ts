import commander from "commander";
import { viewEnvironment, listEnvironments } from "./commands";

export function addEnvironmentSubCommands(command: commander.Command): void {
  command
    .command("view [name]")
    .description("view an environment")
    .action(viewEnvironment);

  command
    .command("list")
    .description("list all environments")
    .action(listEnvironments);
}
