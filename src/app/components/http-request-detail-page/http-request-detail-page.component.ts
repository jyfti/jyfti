import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { HttpRequestStep } from 'src/app/types/step.type';
import {
  selectStep,
  selectStepIndex,
} from 'src/app/ngrx/selectors/dataflow.selectors';

@Component({
  selector: 'app-http-request-detail-page',
  templateUrl: './http-request-detail-page.component.html',
  styles: [],
})
export class HttpRequestDetailPageComponent implements OnInit {
  stepIndex$: Observable<number>;
  step$: Observable<HttpRequestStep>;

  constructor(
    private store: Store<GlobalState>
  ) {}

  ngOnInit() {
    this.stepIndex$ = this.store.pipe(select(selectStepIndex));
    this.step$ = this.store.pipe(select(selectStep));
  }
}
