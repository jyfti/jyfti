import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { HttpRequestStep } from 'src/app/types/step.type';

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
      map(Number)
    );
    this.step$ = this.store.pipe(
      select('dataflow', 'steps'),
      withLatestFrom(this.stepIndex$, (steps, stepIndex) => steps[stepIndex])
    );
  }
}
