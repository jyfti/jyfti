import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { HttpRequestStep } from 'src/app/types/step.type';
import { saveStep } from 'src/app/ngrx/dataflow.actions';

@Component({
  selector: 'app-http-request-detail-page',
  templateUrl: './http-request-detail-page.component.html',
  styles: [],
})
export class HttpRequestDetailPageComponent implements OnInit {
  stepIndex$: Observable<number>;
  step$: Observable<HttpRequestStep>;

  constructor(
    private store: Store<GlobalState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.stepIndex$ = this.route.paramMap.pipe(
      map((params) => params.get('index')),
      filter((index) => !!index),
      map(Number)
    );
    const steps$ = this.store.pipe(select('dataflow', 'steps'));
    this.step$ = this.stepIndex$.pipe(
      withLatestFrom(steps$, (stepIndex, steps) => steps[stepIndex])
    );
  }
}
