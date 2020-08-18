import commander from "commander";
import { state, vars, status, start, complete, step, reset } from "./commands";

export function addRunSubCommands(command: commander.Command) {
  command
    .command("start [name] [inputs...]", { isDefault: true })
    .description("start a run of this workflow")
    .option("-v --verbose", "print step results")
    .option("-c --complete", "run to completion")
    .option("-y --yes", "overwrite an existing workflow with the same name")
    .action(start);

  command
    .command("step [name]")
    .description("execute the next step of this workflow run")
    .option("-v --verbose", "print step result")
    .action(step);

  command
    .command("complete [name]")
    .description("complete the run of this workflow from its current state")
    .option("-v --verbose", "print step results")
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
