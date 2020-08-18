import commander, { Command } from "commander";
import {
  init,
  start,
  step,
  reset,
  view,
  state,
  status,
  list,
  clean,
  complete,
  validate,
  vars,
  install,
} from "./commands";
import { addGenerateSubCommands } from "./generate";
import { addRunSubCommands } from "./run";

export function createProgram(): commander.Command {
  const program = new Command();
  program.version("0.0.1");

  program
    .command("init")
    .description("init this directory for jyfti")
    .action(init);

  program
    .command("install <url>")
    .description("install a workflow from a url")
    .action(install);

  program.command("list").description("list workflows").action(list);

  program
    .command("clean")
    .description("clean the output directory")
    .action(clean);

  program
    .command("view [name]")
    .description("print this workflow")
    .action(view);

  program
    .command("validate [name]")
    .description("validate this workflow")
    .option("-a --all", "validate all workflows")
    .action(validate);

  const generate = program
    .command("generate")
    .description("generate parts of a workflow");

  addGenerateSubCommands(generate);

  const run = program.command("run").description("run a workflow");

  addRunSubCommands(run);

  return program;
}
