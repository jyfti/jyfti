import { Component, OnInit } from '@angular/core';
import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

const createHttpRequest = (json) => new HttpRequest(json.method, json.url);

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    httpRequests: this.fb.array([
      this.fb.group({
        method: ['GET'],
        url: ['http://swapi.dev/api/planets/1/'],
      }),
    ]),
  });

  execution$ = new Subject<HttpRequest<any>[]>();
  executionResult$: Observable<any>;

  get httpRequests() {
    return this.formGroup.get('httpRequests') as FormArray;
  }

  constructor(
    private dataFlowExecutionService: DataFlowExecutionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.executionResult$ = this.execution$.pipe(
      exhaustMap((requests) => this.dataFlowExecutionService.execute(requests))
    );
    this.executionResult$.subscribe();
  }

  execute() {
    const requests = this.formGroup.value['httpRequests'].map(
      createHttpRequest
    );
    this.execution$.next(requests);
  }

  addHttpRequest() {
    this.httpRequests.push(
      this.fb.group({
        method: ['GET'],
        url: ['http://swapi.dev/api/planets/1/'],
      })
    );
  }
}
