import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styles: [],
})
export class StepsComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() evaluations: any;

  @Output() editStepRequest = new EventEmitter<number>();

  constructor(private dataflowFormService: DataflowFormService) {}

  ngOnInit(): void {}

  steps(formGroup) {
    return formGroup.get('steps') as FormArray;
  }

  removeStep(formGroup: FormGroup, stepIndex: number) {
    this.steps(formGroup).removeAt(stepIndex);
  }

  addRequestStep(formGroup: FormGroup) {
    this.steps(formGroup).push(
      this.dataflowFormService.createStep({
        assignTo: 'my_variable',
        request: {
          method: 'GET',
          url: 'http://swapi.dev/api/planets/1/',
          body: null,
          headers: null,
        },
      })
    );
  }

  addEvaluationStep(formGroup: FormGroup) {
    this.steps(formGroup).push(
      this.dataflowFormService.createStep({
        assignTo: 'my_variable',
        expression: {},
      })
    );
  }

  addForLoopStep(formGroup: FormGroup) {
    this.steps(formGroup).push(
      this.dataflowFormService.createStep({
        assignTo: 'my_variable',
        for: {
          const: 'value',
          in: {
            $eval: 'values',
          },
          do: [],
          return: {
            $eval: 'value',
          },
        },
      })
    );
  }
}
