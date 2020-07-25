import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PathedEvaluation } from 'src/app/execution/execution-engine.service';
import { selectExecution } from 'src/app/execution/execution.reducer';
import { GlobalState } from 'src/app/ngrx/dataflow.state';

@Component({
  selector: 'app-execution-log',
  templateUrl: './execution-log.component.html',
  styles: [],
})
export class ExecutionLogComponent implements OnInit {
  pathedEvaluations$: Observable<PathedEvaluation[]>;

  constructor(private store: Store<GlobalState>) {}

  ngOnInit(): void {
    this.pathedEvaluations$ = this.store.pipe(
      select(selectExecution),
      select('executionLog')
    );
  }
}
