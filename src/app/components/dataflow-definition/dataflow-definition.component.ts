import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { Store } from '@ngrx/store';
import { startExecution } from 'src/app/ngrx/dataflow.actions';

const createHttpRequest = (json) => new HttpRequest(json.method, json.url);

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent {
  formGroup: FormGroup = this.fb.group({
    httpRequests: this.fb.array([
      this.fb.group({
        method: ['GET'],
        url: ['http://swapi.dev/api/planets/1/'],
      }),
    ]),
  });

  get httpRequests() {
    return this.formGroup.get('httpRequests') as FormArray;
  }

  constructor(private store: Store<GlobalState>, private fb: FormBuilder) {}

  execute() {
    const httpRequests = this.formGroup.value['httpRequests'].map(
      createHttpRequest
    );
    this.store.dispatch(startExecution({ httpRequests }));
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
