import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dataflow-page',
  templateUrl: './dataflow-page.component.html',
  styles: [],
})
export class DataflowPageComponent implements OnInit {
  formGroup$: Observable<FormGroup>;
  execution$: Observable<any>;
  evaluations$: Observable<any>;

  constructor(
    private store: Store<GlobalState>,
    private dataflowFormService: DataflowFormService
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
}
