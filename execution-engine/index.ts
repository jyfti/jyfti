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
} from "./libs/cli/commands";

const program = new Command();
program.version("0.0.1");

program
  .command("init")
  .description("initializes this directory to be used by jift")
  .action(init);

program.command("list").description("lists workflows").action(list);

program.command("run <name>").description("run this workflow").action(run);

program
  .command("step <name>")
  .description("executes the next step of this workflow")
  .action(step);

program
  .command("reset [name]")
  .description("resets execution states")
  .action(reset);

program.command("view <name>").description("prints this workflow").action(view);

program
  .command("state <name>")
  .description("prints the execution state of this workflow")
  .action(state);

program
  .command("status <name>")
  .description("prints information about the status of the workflow execution")
  .action(status);

program.parse(process.argv);
