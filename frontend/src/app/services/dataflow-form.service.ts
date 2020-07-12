import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { Dataflow } from '../types/dataflow.type';
import { Step, ForLoop } from '../types/step.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';

@Injectable({
  providedIn: 'root',
})
export class DataflowFormService {
  constructor(private fb: FormBuilder) {}

  createDataFlow(dataflow: Dataflow): FormGroup {
    return this.fb.group({
      name: [dataflow.name],
      steps: this.createSteps(dataflow.steps),
    });
  }

  createSteps(steps: Step[]): FormArray {
    return this.fb.array(steps.map((step) => this.createStep(step)));
  }

  createStep(step: Step): FormGroup {
    const content = this.createStepContent(step);
    return this.fb.group({
      assignTo: [step.assignTo],
      [content.type]: content.control,
    });
  }

  createStepContent(step: Step): { type: string; control: AbstractControl } {
    if (step?.request) {
      return {
        type: 'request',
        control: this.createHttpRequestTemplate(step.request),
      };
    } else if (step?.expression) {
      return {
        type: 'expression',
        control: this.fb.control(JSON.stringify(step.expression, null, 2)),
      };
    } else if (step?.for) {
      return {
        type: 'for',
        control: this.createForLoop(step.for),
      };
    }
  }

  createHttpRequestTemplate(request: HttpRequestTemplate): FormGroup {
    return this.fb.group({
      method: [request.method],
      url: [request.url],
      body: [request.body],
      headers: [request.headers],
    });
  }

  createForLoop(forLoop: ForLoop): FormGroup {
    return this.fb.group({
      const: [forLoop.const],
      in: [forLoop.in],
      do: this.createSteps(forLoop.do),
      return: [forLoop.return],
    });
  }
}
