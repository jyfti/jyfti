import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DataFlow } from '../types/data-flow.type';
import { Step } from '../types/step.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';

@Injectable({
  providedIn: 'root',
})
export class DataFlowFormService {
  constructor(private fb: FormBuilder) {}

  createDataFlow(dataflow: DataFlow): FormGroup {
    return this.fb.group({
      steps: this.createSteps(dataflow.steps),
    });
  }

  createSteps(steps: Step[]): FormArray {
    return this.fb.array(steps.map((step) => this.createStep(step)));
  }

  createStep(step: Step): FormGroup {
    return this.fb.group({
      assignTo: [step.assignTo],
      httpRequestTemplate: this.createHttpRequestTemplate(
        step.httpRequestTemplate
      ),
    });
  }

  createHttpRequestTemplate(
    httpRequestTemplate: HttpRequestTemplate
  ): FormGroup {
    return this.fb.group({
      method: [httpRequestTemplate.method],
      url: [httpRequestTemplate.url],
    });
  }
}
