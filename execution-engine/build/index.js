"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var execution_engine_service_1 = require("libs/services/execution-engine.service");
var single_step_service_1 = require("libs/services/single-step.service");
var evaluation_resolvement_service_1 = require("libs/services/evaluation-resolvement.service");
var path_advancement_service_1 = require("libs/services/path-advancement.service");
var step_resolvement_service_1 = require("libs/services/step-resolvement.service");
var fs = __importStar(require("fs"));
var rxjs_1 = require("rxjs");
var httpClientStub = {
    request: function () {
        return rxjs_1.of({ body: [{ title: "My Issue" }, { title: "My other Issue" }] });
    },
};
var service = new execution_engine_service_1.ExecutionEngineService(new single_step_service_1.SingleStepService(httpClientStub), new evaluation_resolvement_service_1.EvaluationResolvementService(), new path_advancement_service_1.PathAdvancementService(), new step_resolvement_service_1.StepResolvementService());
fs.readFile("../local-backend/dataflows/github-issues.json", "utf8", function (err, data) {
    var dataflow = JSON.parse(data);
    service.executeDataflow(dataflow).subscribe(console.log);
});
