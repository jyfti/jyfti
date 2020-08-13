import * as fs from "fs";
import { Command } from "commander";
import { createExecutionEngine } from "libs/services/engine.factory";
import { map } from "rxjs/operators";

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
  .command("tick [path]")
  .description(
    "reads the tick state, executes the next tick and writes back the new tick state"
  )
  .action((path) => {
    path = path || "./jift.state.json";
    fs.readFile(path, "utf8", (err, data) => {
      const json = JSON.parse(data);
      const isTickState = "dataflow" in json;
      const tickState = isTickState
        ? json
        : { dataflow: json, path: [0], evaluations: [] };
      const destination = isTickState ? path : "./jift.state.json";
      if (tickState.path.length === 0) {
        console.log("Dataflow execution already completed");
      } else {
        const engine = createExecutionEngine();
        engine
          .executeTick(tickState)
          .pipe(
            map((pathedEvaluation) => pathedEvaluation.evaluation),
            map((evaluation) => engine.nextTickState(tickState, evaluation)),
            map((nextTickState) => JSON.stringify(nextTickState, null, 2))
          )
          .subscribe((nextTickState) => {
            fs.writeFile(destination, nextTickState, "utf8", console.error);
          });
      }
    });
  });

program.parse(process.argv);
