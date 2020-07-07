import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';
import {
  startExecution,
  resetExecution,
} from 'src/app/ngrx/dataflow-execution.actions';
import { loadedDataflow, persistDataflow } from 'src/app/ngrx/dataflow.actions';
import { selectExecution } from 'src/app/execution/execution.reducer';
import { DataflowFormValueExtractionService } from 'src/app/services/dataflow-form-value-extraction.service';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup$: Observable<FormGroup>;
  execution$: Observable<any>;
  evaluations$: Observable<any>;

  constructor(
    private store: Store<GlobalState>,
    private dataflowFormService: DataflowFormService,
    private dataflowFormValueExtractionService: DataflowFormValueExtractionService
  ) {}

  ngOnInit() {
    this.execution$ = this.store.pipe(select(selectExecution));
    this.formGroup$ = this.store.pipe(
      select('dataflow', 'dataflow'),
      map((dataflow) => this.dataflowFormService.createDataFlow(dataflow))
    );
    this.evaluations$ = this.execution$.pipe(
      map((execution) => execution?.evaluations || {})
    );
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
