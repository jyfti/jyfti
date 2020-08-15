#!/usr/bin/env node

import { Command } from "commander";
import { run } from "./libs/cli/commands/run.command";
import { step } from "./libs/cli/commands/step.command";
import { reset } from "./libs/cli/commands/reset.command";
import { status } from "./libs/cli/commands/status.command";
import { state } from "./libs/cli/commands/state.command";

const program = new Command();
program.version("0.0.1");

program.command("run <name>").description("run a workflow").action(run);

program
  .command("step <name>")
  .description("executes the next step of the given workflow")
  .action(step);

program
  .command("reset <name>")
  .description("resets the execution state of the workflow")
  .action(reset);

program
  .command("state <name>")
  .description("prints the execution state of the workflow")
  .action(state);

program
  .command("status <name>")
  .description("prints information about the status of the workflow execution")
  .action(status);

program.parse(process.argv);
