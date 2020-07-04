import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import {
  resetExecution,
  saveDataflow,
  startExecution,
} from 'src/app/ngrx/dataflow.actions';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup$: Observable<FormGroup>;
  execution$: Observable<any>;
  evaluations$: Observable<any>;

  steps(formGroup) {
    return formGroup.get('steps') as FormArray;
  }

  constructor(
    private store: Store<GlobalState>,
    private dataflowFormService: DataflowFormService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.execution$ = this.store.pipe(select('dataflow', 'execution'));
    this.formGroup$ = this.store.pipe(
      select('dataflow', 'dataflow'),
      map((dataflow) => this.dataflowFormService.createDataFlow(dataflow))
    );
    this.evaluations$ = this.execution$.pipe(
      map((execution) => execution?.evaluations || {})
    );
  }

  execute(formGroup: FormGroup) {
    this.store.dispatch(startExecution({ dataflow: formGroup.value }));
  }

  clearExecution() {
    this.store.dispatch(resetExecution());
  }

  editStep(formGroup: FormGroup, stepIndex: number) {
    this.store.dispatch(saveDataflow({ dataflow: formGroup.value }));
    this.router.navigate(['step', stepIndex], { relativeTo: this.route });
  }

  removeStep(formGroup: FormGroup, stepIndex: number) {
    this.steps(formGroup).removeAt(stepIndex);
  }

  addStep(formGroup: FormGroup) {
    this.steps(formGroup).push(
      this.dataflowFormService.createStep({
        assignTo: 'my_variable',
        request: {
          method: 'GET',
          url: 'http://swapi.dev/api/planets/1/',
        },
      })
    );
  }
}
