import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, filter, startWith } from 'rxjs/operators';
import {
  selectExecution,
  ExecutionState,
} from 'src/app/execution/execution.reducer';
import {
  resetExecution,
  startExecution,
} from 'src/app/ngrx/dataflow-execution.actions';
import { loadedDataflow, persistDataflow } from 'src/app/ngrx/dataflow.actions';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataflowFormValueExtractionService } from 'src/app/services/dataflow-form-value-extraction.service';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';
import { isNil } from 'lodash';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup$: Observable<FormGroup>;
  execution$: Observable<ExecutionState>;
  evaluations$: Observable<any>;

  constructor(
    private store: Store<GlobalState>,
    private dataflowFormService: DataflowFormService,
    private dataflowFormValueExtractionService: DataflowFormValueExtractionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.execution$ = this.store.pipe(select(selectExecution));
    this.formGroup$ = this.store.pipe(
      select('dataflow', 'dataflow'),
      map((dataflow) => this.dataflowFormService.createDataFlow(dataflow))
    );
    this.evaluations$ = this.execution$.pipe(
      map((execution) => execution?.scope?.variables),
      filter((variables) => !isNil(variables)),
      startWith({})
    );
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

  execute(formGroup: FormGroup) {
    this.store.dispatch(
      startExecution({
        dataflow: this.dataflowFormValueExtractionService.extractDataFlow(
          formGroup.value
        ),
      })
    );
  }

  persist(formGroup: FormGroup) {
    this.store.dispatch(
      persistDataflow({
        dataflow: this.dataflowFormValueExtractionService.extractDataFlow(
          formGroup.value
        ),
      })
    );
  }

  clearExecution() {
    this.store.dispatch(resetExecution());
  }
}
