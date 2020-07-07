import { Component, OnInit, Input } from '@angular/core';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { Store } from '@ngrx/store';
import { FormGroup, FormArray } from '@angular/forms';
import { loadedDataflow } from 'src/app/ngrx/dataflow.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { DataflowFormValueExtractionService } from 'src/app/services/dataflow-form-value-extraction.service';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styles: [],
})
export class StepsComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() evaluations: any;

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private route: ActivatedRoute,
    private dataflowFormValueExtractionService: DataflowFormValueExtractionService,
    private dataflowFormService: DataflowFormService
  ) {}

  ngOnInit(): void {}

  steps(formGroup) {
    return formGroup.get('steps') as FormArray;
  }

  editStep(formGroup: FormGroup, stepIndex: number) {
    this.store.dispatch(
      loadedDataflow({
        dataflow: this.dataflowFormValueExtractionService.extractDataFlow(
          formGroup.value
        ),
      })
    );
    this.router.navigate(['step', stepIndex], { relativeTo: this.route });
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
