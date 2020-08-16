#!/usr/bin/env node

import { Command } from "commander";
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
  generateWorkflow,
} from "./libs/cli/commands";

const program = new Command();
program.version("0.0.1");

program
  .command("init")
  .description("init this directory for jyfti")
  .action(init);

program.command("list").description("list workflows").action(list);

program
  .command("clean")
  .description("clean the output directory")
  .action(clean);

program
  .command("start [name] [inputs...]")
  .description("start this workflow")
  .option("-v --verbose", "print step results")
  .option("-c --complete", "run the workflow to completion")
  .action(start);

program
  .command("complete [name]")
  .description("complete this workflow from its current state")
  .option("-v --verbose", "print step results")
  .action(complete);

program
  .command("step [name]")
  .description("execute the next step of this workflow")
  .option("-v --verbose", "print step result")
  .action(step);

program
  .command("reset [name]")
  .description("reset the state of this workflow")
  .action(reset);

program.command("view [name]").description("print this workflow").action(view);

program
  .command("state [name]")
  .description("print the state of this workflow")
  .action(state);

program
  .command("status [name]")
  .description("print the status of the workflow execution")
  .action(status);

program
  .command("validate [name]")
  .description("validate this workflow")
  .option("-a --all", "validate all workflows")
  .action(validate);

const generate = program
  .command("generate")
  .description("generate parts of a workflow");

generate
  .command("workflow [name]")
  .description("generate a workflow")
  .action(generateWorkflow);

program.parse(process.argv);
