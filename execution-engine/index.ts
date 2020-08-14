import * as fs from "fs";
import * as nodePath from "path";
import { Command } from "commander";
import { createExecutionEngine } from "libs/engine/services/engine.factory";
import { map, flatMap } from "rxjs/operators";
import { from } from "rxjs";
import {
  readJson,
  ensureDirExists,
  readJiftConfig,
} from "libs/cli/file.service";

const program = new Command();
program.version("0.0.1");

program
  .command("run <name>")
  .description("run a workflow")
  .action(async (name) => {
    const jiftConfig = await readJiftConfig();
    const workflow = await readJson(
      nodePath.resolve(jiftConfig.sourceRoot, name + ".json")
    );
    const engine = createExecutionEngine();
    engine.executeWorkflow(workflow).subscribe(console.log);
  });

program
  .command("step [name]")
  .description("executes the next step of the given workflow")
  .action(async (name) => {
    const jiftConfig = await readJiftConfig();
    const fullPath = nodePath.resolve(jiftConfig.sourceRoot, name + ".json");
    const fullStatePath = nodePath.resolve(
      jiftConfig.outRoot,
      name + ".state.json"
    );
    await ensureDirExists(jiftConfig.outRoot);
    const workflow = await readJson(fullPath);
    const stateExists = await fs.promises
      .stat(fullStatePath)
      .then(() => true)
      .catch(() => false);
    const tickState = stateExists
      ? await readJson(fullStatePath)
      : { workflow, path: [0], evaluations: [] };
    if (tickState.path.length === 0) {
      console.log("Workflow execution already completed");
    } else {
      const engine = createExecutionEngine();
      engine
        .executeTick(workflow, tickState)
        .pipe(
          map((pathedEvaluation) => pathedEvaluation.evaluation),
          map((evaluation) =>
            engine.nextTickState(workflow, tickState, evaluation)
          ),
          map((nextTickState) => JSON.stringify(nextTickState, null, 2)),
          flatMap((string) =>
            from(
              fs.promises.writeFile(
                nodePath.resolve(jiftConfig.outRoot, name + ".state.json"),
                string,
                "utf8"
              )
            )
          )
        )
        .subscribe();
    }
  });

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
