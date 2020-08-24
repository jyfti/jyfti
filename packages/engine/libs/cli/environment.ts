import commander from "commander";
import { viewEnvironment, listEnvironments } from "./commands";

export function addEnvironmentSubCommands(command: commander.Command) {
  command
    .command("view [name]")
    .description("view an environment")
    .action(viewEnvironment);

  command
    .command("list [name]")
    .description("list all environments")
    .action(listEnvironments);
}
