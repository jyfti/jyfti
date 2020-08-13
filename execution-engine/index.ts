import { ExecutionEngineService } from "libs/services/execution-engine.service";
import { SingleStepService } from "libs/services/single-step.service";
import { HttpService } from "libs/services/http.service";
import { EvaluationResolvementService } from "libs/services/evaluation-resolvement.service";
import { PathAdvancementService } from "libs/services/path-advancement.service";
import { StepResolvementService } from "libs/services/step-resolvement.service";
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
    const engine = createExecutionEngine();
    fs.readFile(path, "utf8", (err, data) => {
      const dataflow = JSON.parse(data);
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
    const engine = createExecutionEngine();
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
