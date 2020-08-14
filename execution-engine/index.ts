import * as fs from "fs";
import * as nodePath from "path";
import { Command } from "commander";
import { readJiftConfig } from "libs/cli/file.service";
import { run } from "libs/cli/commands/run.command";
import { step } from "libs/cli/commands/step.command";

const program = new Command();
program.version("0.0.1");

program.command("run <name>").description("run a workflow").action(run);

program
  .command("step [name]")
  .description("executes the next step of the given workflow")
  .action(step);

program
  .command("reset [name]")
  .description("resets the current execution state of the workflow")
  .action(async (name) => {
    const jiftConfig = await readJiftConfig();
    const fullStatePath = nodePath.resolve(
      jiftConfig.outRoot,
      name + ".state.json"
    );
    await fs.promises.unlink(fullStatePath);
  });

program.parse(process.argv);
