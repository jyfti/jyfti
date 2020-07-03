import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { resetExecution, saveDataflow, startExecution } from 'src/app/ngrx/dataflow.actions';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataFlowFormService } from 'src/app/services/data-flow-form.service';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup: FormGroup;

  get steps() {
    return this.formGroup.get('steps') as FormArray;
  }

  execution$: Observable<any>;
  evaluations$: Observable<any>;

  constructor(
    private store: Store<GlobalState>,
    private dataflowFormService: DataFlowFormService,
    private router: Router
  ) {}

  ngOnInit() {
    this.execution$ = this.store.pipe(select('dataflow', 'execution'));
    this.store
      .pipe(
        select('dataflow', 'dataflow'),
        map((dataflow) => this.dataflowFormService.createDataFlow(dataflow))
      )
      .subscribe((formGroup) => (this.formGroup = formGroup));
    this.evaluations$ = this.execution$.pipe(
      map((execution) => execution?.evaluations || {})
    );
  }

  execute() {
    const steps = this.formGroup.value['steps'];
    this.store.dispatch(startExecution({ steps }));
  }

  clearExecution() {
    this.store.dispatch(resetExecution());
  }

  editStep(stepIndex: number) {
    const steps = this.formGroup.value['steps'];
    this.store.dispatch(saveDataflow({ steps }));
    this.router.navigate(['/step', stepIndex]);
  }

  removeStep(stepIndex: number) {
    this.steps.removeAt(stepIndex);
  }

  addStep() {
    this.steps.push(
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
