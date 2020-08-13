import * as fs from "fs";
import * as nodePath from "path";
import { Command } from "commander";
import { createExecutionEngine } from "libs/services/engine.factory";
import { map, flatMap, tap } from "rxjs/operators";
import { of, from } from "rxjs";

interface JiftConfig {
  dataflowRoot: string;
}

function readJson(path: string) {
  return fs.promises.readFile(path, "utf8").then(JSON.parse);
}

const defaultJiftConfig: JiftConfig = {
  dataflowRoot: "./",
};

function readJiftConfig(): Promise<JiftConfig> {
  return readJson("jift.json").catch((err) => defaultJiftConfig);
}

const program = new Command();
program.version("0.0.1");

program
  .command("run <path>")
  .description("run a dataflow")
  .action(async (path) => {
    const jiftConfig = await readJiftConfig();
    const dataflow = await readJson(
      nodePath.resolve(jiftConfig.dataflowRoot, path)
    );
    const engine = createExecutionEngine();
    engine.executeDataflow(dataflow).subscribe(console.log);
  });

program
  .command("tick [path] [destination]")
  .description(
    "reads the tick state, executes the next tick and writes back the new tick state"
  )
  .action(async (path, destination) => {
    const dataflow = await readJson(path);
    const stateExists = await fs.promises
      .stat("jift.state.json")
      .then(() => true)
      .catch(() => false);
    const tickState = stateExists
      ? await readJson("jift.state.json")
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
