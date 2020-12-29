import commander from "commander";
import {
  state,
  vars,
  status,
  execute,
  complete,
  step,
  reset,
  create,
} from "./commands";
import { parseAssignment } from "./data-access/environment.util";

export function addRunSubCommands(command: commander.Command): void {
  command
    .command("create [name] [inputs...]")
    .description("creates the initial state of a run of this workflow")
    .option("-v --verbose", "print created initial state")
    .option("-y --yes", "automatically answer confirmation questions with yes")
    .option(
      "-e --environment <environment>",
      "the name of the environment",
      "default"
    )
    .option(
      "--env-var [assignment]",
      "an assignment to an individual variable of the expected environment",
      parseAssignment,
      {}
    )
    .action(create);

  command
    .command("execute [name] [inputs...]", { isDefault: true })
    .description("execute a run of this workflow")
    .option("-v --verbose", "print step results")
    .option("-y --yes", "automatically answer confirmation questions with yes")
    .option(
      "-e --environment <environment>",
      "the name of the environment",
      "default"
    )
    .option(
      "--env-var [assignment]",
      "an assignment to an individual variable of the expected environment",
      parseAssignment,
      {}
    )
    .action(execute);

  command
    .command("step [name]")
    .description("execute the next step of this workflow run")
    .option("-v --verbose", "print step result")
    .option(
      "-e --environment <environment>",
      "the name of the environment",
      "default"
    )
    .option(
      "--env-var [assignment]",
      "an assignment to an individual variable of the expected environment",
      parseAssignment,
      {}
    )
    .action(step);

  command
    .command("complete [name]")
    .description("complete the run of this workflow from its current state")
    .option("-v --verbose", "print step results")
    .option(
      "-e --environment <environment>",
      "the name of the environment",
      "default"
    )
    .option(
      "--env-var [assignment]",
      "an assignment to an individual variable of the expected environment",
      parseAssignment,
      {}
    )
    .action(complete);

  command
    .command("reset [name]")
    .description("reset the run of this workflow")
    .action(reset);

  command
    .command("status [name]")
    .description("print the current status of the run of this workflow")
    .action(status);

  command
    .command("state [name]")
    .description("print the current state of the run of this workflow")
    .action(state);

  command
    .command("vars [name]")
    .description("print the current variables of the run of this workflow")
    .action(vars);
}
