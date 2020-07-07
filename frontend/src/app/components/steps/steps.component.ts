import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styles: [],
})
export class StepsComponent implements OnInit {
  @Input() steps: FormArray;
  @Input() evaluations: any;

  @Output() editStepRequest = new EventEmitter<number>();

  constructor(private dataflowFormService: DataflowFormService) {}

  ngOnInit(): void {}

  removeStep(stepIndex: number) {
    this.steps.removeAt(stepIndex);
  }

  addRequestStep() {
    this.steps.push(
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

  addEvaluationStep() {
    this.steps.push(
      this.dataflowFormService.createStep({
        assignTo: 'my_variable',
        expression: {},
      })
    );
  }

  addForLoopStep() {
    this.steps.push(
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
