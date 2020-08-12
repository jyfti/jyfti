import { ExecutionEngineService } from "libs/services/execution-engine.service";
import { SingleStepService } from "libs/services/single-step.service";
import { HttpService } from "libs/services/http.service";
import { EvaluationResolvementService } from "libs/services/evaluation-resolvement.service";
import { PathAdvancementService } from "libs/services/path-advancement.service";
import { StepResolvementService } from "libs/services/step-resolvement.service";
import * as fs from "fs";
import { of } from "rxjs";

const httpClientStub: Partial<HttpService> = {
  request: () =>
    of({ body: [{ title: "My Issue" }, { title: "My other Issue" }] }),
};
let service = new ExecutionEngineService(
  new SingleStepService(new HttpService()),
  new EvaluationResolvementService(),
  new PathAdvancementService(),
  new StepResolvementService()
);

fs.readFile(
  "../local-backend/dataflows/github-issues.json",
  "utf8",
  (err, data) => {
    const dataflow = JSON.parse(data);
    service.executeDataflow(dataflow).subscribe(console.log);
  }
);
