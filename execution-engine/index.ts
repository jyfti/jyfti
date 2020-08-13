import * as fs from "fs";
import { Command } from "commander";
import { createExecutionEngine } from "libs/services/engine.factory";
import { map, flatMap, tap } from "rxjs/operators";
import { of, from } from "rxjs";

const program = new Command();
program.version("0.0.1");

program
  .command("run <path>")
  .description("run a dataflow")
  .action((path) => {
    fs.readFile(path, "utf8", (err, data) => {
      const dataflow = JSON.parse(data);
      const engine = createExecutionEngine();
      engine.executeDataflow(dataflow).subscribe(console.log);
    });
  });

program
  .command("tick [path] [destination]")
  .description(
    "reads the tick state, executes the next tick and writes back the new tick state"
  )
  .action(async (path, destination) => {
    const dataflow = JSON.parse(await fs.promises.readFile(path, "utf8"));
    const stateExists = await fs.promises
      .stat("jift.state.json")
      .then(() => true)
      .catch(() => false);
    const tickState = stateExists
      ? JSON.parse(await fs.promises.readFile("jift.state.json", "utf8"))
      : { dataflow, path: [0], evaluations: [] };
    if (tickState.path.length === 0) {
      console.log("Dataflow execution already completed");
    } else {
      const engine = createExecutionEngine();
      engine
        .executeTick(tickState)
        .pipe(
          map((pathedEvaluation) => pathedEvaluation.evaluation),
          map((evaluation) => engine.nextTickState(tickState, evaluation)),
          map((nextTickState) => JSON.stringify(nextTickState, null, 2)),
          flatMap((string) =>
            destination
              ? from(fs.promises.writeFile(destination, string, "utf8"))
              : of(string).pipe(tap(console.log))
          )
        )
        .subscribe();
    }
  });

program.parse(process.argv);
