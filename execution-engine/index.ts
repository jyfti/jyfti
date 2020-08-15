#!/usr/bin/env node

import { Command } from "commander";
import {
  init,
  run,
  step,
  reset,
  view,
  state,
  status,
  list,
  clean,
} from "./libs/cli/commands";

const program = new Command();
program.version("0.0.1");

program
  .command("init")
  .description("init this directory for jift")
  .action(init);

program.command("list").description("list workflows").action(list);

program
  .command("clean")
  .description("clean the output directory")
  .action(clean);

program.command("run [name]").description("run this workflow").action(run);

program
  .command("step [name]")
  .description("execute the next step of this workflow")
  .action(step);

program
  .command("reset [name]")
  .description("reset execution states")
  .action(reset);

program.command("view [name]").description("print this workflow").action(view);

program
  .command("state [name]")
  .description("print the execution state of this workflow")
  .action(state);

program
  .command("status [name]")
  .description("print information about the status of the workflow execution")
  .action(status);

program.parse(process.argv);
